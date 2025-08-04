"use client";
import React, { useState } from "react";
interface Props {
  setPlayers: (val: 1 | 2 | 3 | 4) => void;
  setSize: (val: "4x4" | "6x6") => void;
  setTheme: (val: "numbers" | "icons") => void;
  setView: (val: "mode" | "game") => void;
  theme: "numbers" | "icons";
  size: "4x4" | "6x6";
  players: 1 | 2 | 3 | 4;
}
const SelectFormat = ({
  setPlayers,
  setSize,
  setTheme,
  setView,
  theme,
  size,
  players,
}: Props) => {
  return (
    <div className="modeContainer">
      <h4>memory</h4>
      <div className="modes">
        <div className="themes">
          <p>Select Theme</p>
          <div className="btns">
            <button
              className={theme === "numbers" ? "activeTheme" : ""}
              onClick={() => setTheme("numbers")}
            >
              Numbers
            </button>
            <button
              className={theme === "icons" ? "activeTheme" : ""}
              onClick={() => setTheme("icons")}
            >
              Icons
            </button>
          </div>
        </div>
        <div className="players">
          <p>Numbers of Players</p>{" "}
          <div className="btns">
            <button
              className={players === 1 ? "activeTheme" : ""}
              onClick={() => setPlayers(1)}
            >
              1
            </button>
            <button
              className={players === 2 ? "activeTheme" : ""}
              onClick={() => setPlayers(2)}
            >
              2{" "}
            </button>{" "}
            <button
              className={players === 3 ? "activeTheme" : ""}
              onClick={() => setPlayers(3)}
            >
              3{" "}
            </button>
            <button
              className={players === 4 ? "activeTheme" : ""}
              onClick={() => setPlayers(4)}
            >
              4{" "}
            </button>
          </div>
        </div>
        <div className="size">
          <p>Grid Size</p>
          <div className="btns">
            <button
              className={size === "4x4" ? "activeTheme" : ""}
              onClick={() => setSize("4x4")}
            >
              4x4
            </button>
            <button
              className={size === "6x6" ? "activeTheme" : ""}
              onClick={() => setSize("6x6")}
            >
              6x6
            </button>
          </div>
        </div>{" "}
        <button
          onClick={() =>
            setTimeout(() => {
              setView("game");
            }, 500)
          }
          className="startBtn"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default SelectFormat;
