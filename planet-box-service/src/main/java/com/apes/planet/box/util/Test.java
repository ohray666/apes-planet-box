package com.apes.planet.box.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Test {
    public static void main(String[] args) {
        double lat_deg = 52.603895;
        double lon_deg = 13.356983;
        int zoom = 13;
        double lat_rad = Math.toRadians(lat_deg);
        System.out.println(lat_rad);
        double n = Math.pow(2.0, zoom);
        int xtile = (int) Math.round((lon_deg + 180) / 360 * n);
        int ytile = (int) Math.round((1.0 - Math.log(Math.tan(lat_rad) + (1/ Math.cos(lat_rad))) / Math.PI) /  2.0 * n);
        System.out.println("xtile:" + xtile + " ytile:" + ytile + " random:" + Math.random());
        String[] map_zxy_arrays = new String[100];
        int randomIntegerBetweenRange = getRandomIntegerBetweenRange(2, 6);
        System.out.println(randomIntegerBetweenRange);
        double randomDoubleBetweenRange = getRandomDoubleBetweenRange(-360, 360);
        System.out.println(randomDoubleBetweenRange);

        List test = new ArrayList();
        Random random = new Random();
        Math.random();


//        for (int i = 0; i < 200; i++) {
//            int z =
//        }
    }

    public static int getRandomIntegerBetweenRange(double min, double max){
        int x = (int)((Math.random() * ((max - min) + 1)) + min);
        return x;
    }

    public static double getRandomDoubleBetweenRange(double min, double max){
        double x = (Math.random() * ((max - min) + 1)) + min;
        return x;
    }
}
