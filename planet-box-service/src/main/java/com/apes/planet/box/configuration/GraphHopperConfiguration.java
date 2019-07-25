package com.apes.planet.box.configuration;

import com.graphhopper.GraphHopper;
import com.graphhopper.reader.osm.GraphHopperOSM;
import com.graphhopper.util.CmdArgs;
import com.graphhopper.util.TranslationMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphHopperConfiguration {

    private String instruction;
    private long seed;
    private int count;

    @Bean
    public GraphHopper graphHopper() {

//        CmdArgs graphHopperConfiguration = new CmdArgs();
//        graphHopperConfiguration.put("graph.location", "graph-cache");
//
//        GraphHopper gh = new GraphHopperOSM();
//        gh.init(graphHopperConfiguration).forServer();
//        gh.getCHFactoryDecorator().setEnabled(false);
//        gh.getCHFactoryDecorator().setDisablingAllowed(true);
//        gh.importOrLoad();
        CmdArgs graphHopperConfiguration = new CmdArgs();
        graphHopperConfiguration.put("graph.location", "graph-cache");
        GraphHopper hopper = new GraphHopperOSM().init(graphHopperConfiguration);
        hopper.getCHFactoryDecorator().setEnabled(false);
        System.out.println("loading graph from cache");
        hopper.load(graphHopperConfiguration.get("graph.location", "graph-cache"));
        return hopper;
    }

    @Bean
    public TranslationMap translationMap() {
        TranslationMap translationMap = new TranslationMap().doImport();
        return translationMap;
    }
}
