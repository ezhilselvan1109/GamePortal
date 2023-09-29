package com.game.sudoku;

public class Sudoku {
    private int total_minute;
    private int total_second;
    private int errors;

    public Sudoku() {
    }

    public Sudoku(int total_minute, int total_second, int errors) {
        this.total_minute = total_minute;
        this.total_second = total_second;
        this.errors = errors;
    }

    public int getTotal_minute() {
        return total_minute;
    }

    public int getTotal_second() {
        return total_second;
    }

    public int getErrors() {
        return errors;
    }

    @Override
    public String toString() {
        return "{\"total_mintue\" : " + total_minute + ", \"total_second\" : " + total_second + ", \"errors\" :" + errors + '}';
    }
}
