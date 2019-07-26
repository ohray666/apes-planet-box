package com.apes.planet.box.services;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.apes.planet.box.cache.MapCache;
import com.apes.planet.box.controller.PlanetBoxController;
import com.apes.planet.box.core.MapMatching;
import com.apes.planet.box.core.MatchResult;
import com.apes.planet.box.core.Observation;
import com.apes.planet.box.gpx.Gpx;
import com.apes.planet.box.gpx.Trk;
import com.apes.planet.box.gpx.Trkpt;
import com.apes.planet.box.gpx.Trkseg;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.PathWrapper;
import com.graphhopper.http.WebHelper;
import com.graphhopper.routing.AlgorithmOptions;
import com.graphhopper.routing.util.HintsMap;
import com.graphhopper.util.*;
import com.graphhopper.util.gpx.GpxFromInstructions;
import com.graphhopper.util.shapes.GHPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.PublicKey;
import java.text.NumberFormat;
import java.util.*;

import static com.graphhopper.http.WebHelper.encodePolyline;
import static com.graphhopper.util.Parameters.Routing.CALC_POINTS;
import static com.graphhopper.util.Parameters.Routing.INSTRUCTIONS;
import static com.graphhopper.util.Parameters.Routing.WAY_POINT_MAX_DISTANCE;

@Service
public class MatchingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchingService.class);

//    private final XmlMapper xmlMapper = new XmlMapper();

    private final GraphHopper graphHopper;
    private final TranslationMap translationMap;
    private final int defaultMaxVisitedNodes = 3000;

    @Autowired
    public MatchingService(GraphHopper graphHopper, TranslationMap translationMap) {
        this.graphHopper = graphHopper;
        this.translationMap = translationMap;
    }

    public JSONObject match(String gpxFile) {
        boolean instructions = true, calcPoints = true, enableElevation = false, pointsEncoded = true, enableTraversalKeys = false;
        List<String> pathDetails = new ArrayList<>();
        int maxVisitedNodes = 3000;
        String vehicleStr = "car";
        StopWatch sw = new StopWatch().start();

        AlgorithmOptions opts = AlgorithmOptions.start()
                .traversalMode(graphHopper.getTraversalMode())
                .maxVisitedNodes(maxVisitedNodes)
                .hints(new HintsMap().put("vehicle", vehicleStr))
                .build();

        MapMatching mapMatching = new MapMatching(graphHopper, opts);
//        matching.setMeasurementErrorSigma(Integer.parseInt((String)queryString.get("gps_accuracy")));
        mapMatching.setMeasurementErrorSigma(10);
        XmlMapper xmlMapper = new XmlMapper();
        Gpx gpx = new Gpx();
        try {
            gpx = xmlMapper.readValue(gpxFile, Gpx.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (gpx.trk == null) {
            throw new IllegalArgumentException("No tracks found in GPX document. Are you using waypoints or routes instead?");
        }
        if (gpx.trk.size() > 1) {
            throw new IllegalArgumentException("GPX documents with multiple tracks not supported yet.");
        }
        List<Observation> measurements = gpx.trk.get(0).getEntries();
        MatchResult matchResult = mapMatching.doWork(measurements);

        float took = sw.stop().getSeconds();

        Translation tr = new TranslationMap().doImport().getWithFallBack(Helper.getLocale("en"));
        DouglasPeucker peucker = new DouglasPeucker().setMaxDistance(1.0);
        PathMerger pathMerger = new PathMerger().
                setEnableInstructions(true).
                setPathDetailsBuilders(graphHopper.getPathDetailsBuilderFactory(), pathDetails).
                setDouglasPeucker(peucker).
                setSimplifyResponse(1.0 > 0);
        PathWrapper pathWrapper = new PathWrapper();
        pathMerger.doWork(pathWrapper, Collections.singletonList(matchResult.getMergedPath()), graphHopper.getEncodingManager(), tr);

        // GraphHopper thinks an empty path is an invalid path, and further that an invalid path is still a path but
        // marked with a non-empty list of Exception objects. I disagree, so I clear it.
        pathWrapper.getErrors().clear();
        GHResponse rsp = new GHResponse();
        rsp.add(pathWrapper);


        ObjectNode map = WebHelper.jsonObject(rsp, instructions, calcPoints, enableElevation, pointsEncoded, took);

        Map<String, Object> matchStatistics = new HashMap<>();
        matchStatistics.put("distance", matchResult.getMatchLength());
        matchStatistics.put("time", matchResult.getMatchMillis());
        matchStatistics.put("original_distance", matchResult.getGpxEntriesLength());
        map.putPOJO("map_matching", matchStatistics);

        JSONObject json = new JSONObject();
        JSONArray paths = new JSONArray();
        Iterator<Map.Entry<String, JsonNode>> fields = map.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> next = fields.next();
            if (!next.getKey().equalsIgnoreCase("paths")) {
                json.put(next.getKey(), next.getValue().toString());
            } else {
                JsonNode matchPaths = map.get("paths");
                for (int i = 0; i < matchPaths.size(); i++) {
                    JSONObject path = new JSONObject();
                    Iterator<Map.Entry<String, JsonNode>> iterator = matchPaths.get(0).fields();
                    while (iterator.hasNext()) {
                        Map.Entry<String, JsonNode> nextPath = iterator.next();
                        path.put(nextPath.getKey(), nextPath.getValue().toString());
                    }
                    paths.add(path);
                }
            }
        }
        json.put("paths", paths);
        return json;
    }

    public String matchXML(String gpxFile) {
        boolean instructions = true, calcPoints = true, enableElevation = false, pointsEncoded = true, enableTraversalKeys = false;
        List<String> pathDetails = new ArrayList<>();
        int maxVisitedNodes = 3000;
        String vehicleStr = "car";
        StopWatch sw = new StopWatch().start();

        AlgorithmOptions opts = AlgorithmOptions.start()
                .traversalMode(graphHopper.getTraversalMode())
                .maxVisitedNodes(maxVisitedNodes)
                .hints(new HintsMap().put("vehicle", vehicleStr))
                .build();

        MapMatching mapMatching = new MapMatching(graphHopper, opts);
//        matching.setMeasurementErrorSigma(Integer.parseInt((String)queryString.get("gps_accuracy")));
        mapMatching.setMeasurementErrorSigma(10);
        XmlMapper xmlMapper = new XmlMapper();
        Gpx gpx = new Gpx();
        try {
            gpx = xmlMapper.readValue(gpxFile, Gpx.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (gpx.trk == null) {
            throw new IllegalArgumentException("No tracks found in GPX document. Are you using waypoints or routes instead?");
        }
        if (gpx.trk.size() > 1) {
            throw new IllegalArgumentException("GPX documents with multiple tracks not supported yet.");
        }
        List<Observation> measurements = gpx.trk.get(0).getEntries();
        MatchResult matchResult = mapMatching.doWork(measurements);

        float took = sw.stop().getSeconds();

        Translation tr = new TranslationMap().doImport().getWithFallBack(Helper.getLocale("en"));
        DouglasPeucker peucker = new DouglasPeucker().setMaxDistance(1.0);
        PathMerger pathMerger = new PathMerger().
                setEnableInstructions(true).
                setPathDetailsBuilders(graphHopper.getPathDetailsBuilderFactory(), pathDetails).
                setDouglasPeucker(peucker).
                setSimplifyResponse(1.0 > 0);
        PathWrapper pathWrapper = new PathWrapper();
        pathMerger.doWork(pathWrapper, Collections.singletonList(matchResult.getMergedPath()), graphHopper.getEncodingManager(), tr);

        // GraphHopper thinks an empty path is an invalid path, and further that an invalid path is still a path but
        // marked with a non-empty list of Exception objects. I disagree, so I clear it.
        pathWrapper.getErrors().clear();
        GHResponse rsp = new GHResponse();
        rsp.add(pathWrapper);


        ObjectNode map = WebHelper.jsonObject(rsp, instructions, calcPoints, enableElevation, pointsEncoded, took);

        Map<String, Object> matchStatistics = new HashMap<>();
        matchStatistics.put("distance", matchResult.getMatchLength());
        matchStatistics.put("time", matchResult.getMatchMillis());
        matchStatistics.put("original_distance", matchResult.getGpxEntriesLength());
        map.putPOJO("map_matching", matchStatistics);

        long time = gpx.trk.get(0).getStartTime()
                .map(Date::getTime)
                .orElse(System.currentTimeMillis());
        String outputXml = GpxFromInstructions.createGPX(pathWrapper.getInstructions(), gpx.trk.get(0).name != null ? gpx.trk.get(0).name : "", time, graphHopper.hasElevation(), true, true, false, Constants.VERSION, tr);
        return outputXml;
    }


    public JSONObject match(String vin, JSONObject jsonObject) {
        boolean instructions = true, calcPoints = true, enableElevation = false, pointsEncoded = true, enableTraversalKeys = false;
        List<String> pathDetails = new ArrayList<>();
        int maxVisitedNodes = 3000;
        String vehicleStr = "car";
        StopWatch sw = new StopWatch().start();

        AlgorithmOptions opts = AlgorithmOptions.start()
                .traversalMode(graphHopper.getTraversalMode())
                .maxVisitedNodes(maxVisitedNodes)
                .hints(new HintsMap().put("vehicle", vehicleStr))
                .build();

        MapMatching mapMatching = new MapMatching(graphHopper, opts);
        mapMatching.setMeasurementErrorSigma(10);
        XmlMapper xmlMapper = new XmlMapper();
        Gpx gpx = new Gpx();
        try {
            gpx = getTrkseg(vin, jsonObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (gpx.trk == null) {
            LOGGER.info("the number of historical track points are less than 3, throw the received payload. vin: {}, payload ", vin, jsonObject);
            return new JSONObject();
        }
        if (gpx.trk.size() > 1) {
            throw new IllegalArgumentException("GPX documents with multiple tracks not supported yet.");
        }
        List<Observation> measurements = gpx.trk.get(0).getEntries();
        MatchResult matchResult = mapMatching.doWork(measurements);

        float took = sw.stop().getSeconds();

        Translation tr = new TranslationMap().doImport().getWithFallBack(Helper.getLocale("en"));
        DouglasPeucker peucker = new DouglasPeucker().setMaxDistance(1.0);
        PathMerger pathMerger = new PathMerger().
                setEnableInstructions(true).
                setPathDetailsBuilders(graphHopper.getPathDetailsBuilderFactory(), pathDetails).
                setDouglasPeucker(peucker).
                setSimplifyResponse(1.0 > 0);
        PathWrapper pathWrapper = new PathWrapper();
        pathMerger.doWork(pathWrapper, Collections.singletonList(matchResult.getMergedPath()), graphHopper.getEncodingManager(), tr);

        // GraphHopper thinks an empty path is an invalid path, and further that an invalid path is still a path but
        // marked with a non-empty list of Exception objects. I disagree, so I clear it.
        pathWrapper.getErrors().clear();
        GHResponse rsp = new GHResponse();
        rsp.add(pathWrapper);


        ObjectNode map = WebHelper.jsonObject(rsp, instructions, calcPoints, enableElevation, pointsEncoded, took);

        Map<String, Object> matchStatistics = new HashMap<>();
        matchStatistics.put("distance", matchResult.getMatchLength());
        matchStatistics.put("time", matchResult.getMatchMillis());
        matchStatistics.put("original_distance", matchResult.getGpxEntriesLength());
        map.putPOJO("map_matching", matchStatistics);

        JSONObject json = new JSONObject();
        JSONArray paths = new JSONArray();
        Iterator<Map.Entry<String, JsonNode>> fields = map.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> next = fields.next();
            if (!next.getKey().equalsIgnoreCase("paths")) {
                json.put(next.getKey(), next.getValue().toString());
            } else {
                JsonNode matchPaths = map.get("paths");
                for (int i = 0; i < matchPaths.size(); i++) {
                    JSONObject path = new JSONObject();
                    Iterator<Map.Entry<String, JsonNode>> iterator = matchPaths.get(0).fields();
                    while (iterator.hasNext()) {
                        Map.Entry<String, JsonNode> nextPath = iterator.next();
                        path.put(nextPath.getKey(), nextPath.getValue().toString());
                    }
                    paths.add(path);
                }
            }
        }
        json.put("paths", paths);
        return json;
    }

    public Gpx getTrkseg(String vin, JSONObject payload) {
        Gpx gpx = new Gpx();
        JSONObject json = (JSONObject) MapCache.get(vin);
        if (json == null) {
            return gpx;
        }
        JSONArray trksegJsonArray = json.getJSONArray("trkseg");
        if (trksegJsonArray == null || trksegJsonArray.size() < 3) {
            return gpx;
        }


        Trkseg trkseg = new Trkseg();
        List<Trkpt> trkptList = new ArrayList<>();
        for (Object o : trksegJsonArray) {
            if (o instanceof JSONObject) {
                String altitude = ((JSONObject) o).getString("altitude");
                String latitude = ((JSONObject) o).getString("latitude");
                String longitude = ((JSONObject) o).getString("longitude");
                String timestamp = ((JSONObject) o).getString("timestamp");
                Double ele = Double.parseDouble(altitude);
                Double lat = Double.parseDouble(latitude);
                Double lon = Double.parseDouble(longitude);
                Date date = new Date(Long.parseLong(timestamp));
                Trkpt trkpt = new Trkpt(ele, lat, lon, date);
                trkptList.add(trkpt);
            }
        }
        trkseg.setTrkpt(trkptList);
        List<Trkseg> trksegList = new ArrayList<>();
        trksegList.add(trkseg);

        Trk trk = new Trk();
        trk.setTrkseg(trksegList);
        trk.setName("GraphHopper");

        List<Trk> trkList = new ArrayList<>();
        trkList.add(trk);

        gpx.setTrk(trkList);


        return gpx;
    }

    public void updateCache(String key, JSONObject payload) {
        JSONObject json = (JSONObject) MapCache.get(key);
        if (json == null) {
            json = new JSONObject();
        }

        JSONArray trksegJsonArray = json.getJSONArray("trkseg");
        if (trksegJsonArray == null) {
            trksegJsonArray = new JSONArray();
        }

        JSONObject position = null;
        try {
            position = payload.getJSONObject("body")
                    .getJSONObject("serviceData")
                    .getJSONArray("telemetry")
                    .getJSONObject(0)
                    .getJSONObject("position");
        } catch (Exception e) {
            LOGGER.error("throw the received payload. ", e);
        }
        if (position != null) {
            trksegJsonArray.add(position);
        }
        json.put("trkseg", trksegJsonArray);
        MapCache.put(key, json);
    }

    public JSONObject getRoute(JSONObject payload) {
        StopWatch sw = new StopWatch().start();
        JSONObject result = new JSONObject();
        GHRequest request;
        boolean calcPoints = true;

        List<GHPoint> requestPoints = new ArrayList<>();

        GHPoint startPoint = GHPoint.fromString(payload.getString("startPoint"));
        GHPoint endPoint = GHPoint.fromString(payload.getString("endPoint"));
        requestPoints.add(startPoint);
        requestPoints.add(endPoint);
        request = new GHRequest(requestPoints);
        request.setVehicle(payload.getString("vehicle")).
                setWeighting(payload.getString("weighting")).
                setAlgorithm(payload.getString("algoStr")).
                setLocale(payload.getString("locale")).
//                setPointHints(pointHints).
//                setSnapPreventions(snapPreventions).
//                setPathDetails(pathDetails).
                getHints().
                put(CALC_POINTS, true).
                put(INSTRUCTIONS, true).
                put(WAY_POINT_MAX_DISTANCE, payload.getIntValue("minPathPrecision"));

        GHResponse ghResponse = graphHopper.route(request);
        float took = sw.stop().getSeconds();
        result.put("hints", request.getHints().toMap());
        result.put("took", took);
        JSONArray paths = new JSONArray();
        for (PathWrapper ar : ghResponse.getAll()) {
            JSONObject jsonPath = new JSONObject();
            jsonPath.put("distance", Helper.round(ar.getDistance(), 3));
            jsonPath.put("weight", Helper.round6(ar.getRouteWeight()));
            jsonPath.put("time", ar.getTime());
            jsonPath.put("transfers", ar.getNumChanges());
            if (!ar.getDescription().isEmpty()) {
                jsonPath.put("description", ar.getDescription());
            }
            if (calcPoints) {
                jsonPath.put("points_encoded", true);
//                if (ar.getPoints().getSize() >= 2) {
//                    jsonPath.put("bbox", ar.calcBBox2D());
//                }
                jsonPath.put("points", WebHelper.encodePolyline(ar.getPoints(), false)) ;
                jsonPath.put("instructions", ar.getInstructions());
                jsonPath.put("legs", ar.getLegs());
                jsonPath.put("details", ar.getPathDetails());
                jsonPath.put("ascend", ar.getAscend());
                jsonPath.put("descend", ar.getDescend());
            }
            jsonPath.put("snapped_waypoints", WebHelper.encodePolyline(ar.getPoints(), false));
            if (ar.getFare() != null) {
                jsonPath.put("fare", NumberFormat.getCurrencyInstance(Locale.ROOT).format(ar.getFare()));
            }
            paths.add(jsonPath);
        }
        result.put("paths", paths);
//        graphHopper.route();
        return result;
    }


}
