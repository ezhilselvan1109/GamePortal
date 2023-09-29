package com.game.session;

public class Session {
    private final String members_name;
    private final String members_email;
    private final int session_id;
    private final String session_game;
    private final int request_session_from;
    private final int request_session_to;
    private final String choice;
    private final boolean isPlayed;

    public Session(String members_name, String members_email, int session_id, String session_game, int request_session_from, int request_session_to, String choice, boolean isPlayed) {
        this.members_name = members_name;
        this.members_email = members_email;
        this.session_id = session_id;
        this.session_game = session_game;
        this.request_session_from = request_session_from;
        this.request_session_to = request_session_to;
        this.choice = choice;
        this.isPlayed = isPlayed;
    }
}
