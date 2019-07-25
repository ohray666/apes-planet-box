package com.apes.planet.box.cache;

import java.util.concurrent.ConcurrentHashMap;

public class MapCache {

    private static class CacheHolder {
        private static ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();
    }

    private static  ConcurrentHashMap<String, Object> getCache() {
        return CacheHolder.cache;
    }

    public static Object get(String key) {
        return getCache().get(key);
    }

    public static void put(String key, Object value){
        getCache().put(key, value);
    }

}
