package com.apes.planet.box.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.apes.planet.box.cache.MapCache;
import com.apes.planet.box.services.MatchingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Api(tags = "map-api-v1")
@CrossOrigin
@RestController
@RequestMapping(value = "/v1")
public class PlanetBoxController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PlanetBoxController.class);

    private static final String TRIP_ID = "tripId";

    @Autowired
    private MatchingService matchingService;

    @RequestMapping(value = "/xmlmatch", method = RequestMethod.POST, consumes = "application/gpx+xml", produces = "application/gpx+xml")
    @ResponseBody
    public String snapToRoadXml(HttpServletRequest request, @RequestBody String payload) throws JsonProcessingException {
        System.out.println(payload);
        String outputXml = matchingService.matchXML(payload);
        return outputXml;
    }

//    @RequestMapping(value = "/match", method = RequestMethod.POST, consumes = "application/gpx+xml")
//    @ResponseBody
//    public JSONObject snapToRoad(HttpServletRequest request, @RequestBody String payload) throws IOException {
//        System.out.println(payload);
//        JSONObject match = matchingService.match(payload);
//        return match;
//    }

    @RequestMapping(value = "/pos-match/{vin}", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public JSONObject match(HttpServletRequest request, @PathVariable String vin, @RequestParam String type, @RequestBody JSONObject payload) throws IOException {
        LOGGER.info("Into PlanetBoxController match method, vin{}, type:{} vehicleData:{}", vin, type, payload);
        JSONObject match = new JSONObject();
        if ("telemetry".equalsIgnoreCase(type)) {
            matchingService.updateCache(vin, payload);
        }
        match = matchingService.match(vin, type, payload);
        System.out.println(payload);
        return match;
    }

    @RequestMapping(value = "/init/{vin}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject init(HttpServletRequest request, @PathVariable String vin) throws IOException {
        LOGGER.info("into PlanetBoxController init method, vin{}, type:{} vehicleData:{}", vin);
        JSONObject result = new JSONObject();
        result.put("description", "init vin (" + vin + ")");
        matchingService.deleteCache(vin);
        return result;
    }

    @RequestMapping(value = "/route/{vin}", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public JSONObject route(HttpServletRequest request, @PathVariable String vin, @RequestBody JSONObject payload) throws IOException {
        LOGGER.info("Into PlanetBoxController match method, vin{}, vehicleData:{}", vin, payload);
        JSONObject route = matchingService.getRoute(payload);
        return route;
    }

}
