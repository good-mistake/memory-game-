"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import SelectFormat from "./SelectFormat";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faBurst,
  faBreadSlice,
  faBowlRice,
  faAppleWhole,
  faHandcuffs,
  faHeadphones,
  faSkull,
  faRadiation,
  faPizzaSlice,
  faPaw,
  faFingerprint,
  faPuzzlePiece,
  faEye,
  faLeaf,
  faDice,
  faCookieBite,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { motion, AnimatePresence } from "framer-motion";
import Anchor from "../../public/assets/anchor.svg";
import Bug from "../../public/assets/bug.svg";
import Car from "../../public/assets/car.svg";
import Flask from "../../public/assets/flask.svg";
import Futbol from "../../public/assets/futbol.svg";
import Hand from "../../public/assets/hand-spock.svg";
import Lira from "../../public/assets/lira-sign.svg";
import Moon from "../../public/assets/moon.svg";
import Snowflake from "../../public/assets/snowflake.svg";
import Sun from "../../public/assets/sun.svg";

const customIcons = [
  () => <Image src={Anchor} alt="anchor" />,
  () => <Image src={Bug} alt="bug" />,
  () => <Image src={Car} alt="car" />,
  () => <Image src={Flask} alt="anchor" />,
  () => <Image src={Futbol} alt="bug" />,
  () => <Image src={Hand} alt="car" />,
  () => <Image src={Lira} alt="anchor" />,
  () => <Image src={Moon} alt="bug" />,
  () => <Image src={Snowflake} alt="car" />,
  () => <Image src={Sun} alt="anchor" />,
];
const icons = [
  faCubes,
  faAppleWhole,
  faHeadphones,
  faPizzaSlice,
  faPaw,
  faPuzzlePiece,
  faDice,
  faLeaf,
  faCookieBite,
  faEye,
];

export default function Home() {
  const [theme, setTheme] = useState<"numbers" | "icons">("numbers");
  const [players, setPlayers] = useState<1 | 2 | 3 | 4>(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [size, setSize] = useState<"4x4" | "6x6">("4x4");
  const [view, setView] = useState<"mode" | "game">("mode");
  const [scores, setScores] = useState<number[]>(Array(players).fill(0));
  const [cards, setCards] = useState<
    {
      id: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: string | IconDefinition | React.ComponentType<any>;
      flipped: boolean;
      matched: boolean;
    }[]
  >([]);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [width, setWidth] = useState(0);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const maxScore = Math.max(...scores);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (view === "game") {
      initializeGame();
    }
  }, [view, theme, size, players]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setTimerActive(false);
      setGameOver(true);
      confetti({ spread: 70, origin: { y: 0.6 } });
    }
  }, [cards]);
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      if (newWidth > 600 && menu) {
        setMenu(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menu]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menu &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menu, gameOver]);
  const initializeGame = () => {
    const grid = parseInt(size);
    const detail =
      theme === "icons"
        ? [...icons, ...customIcons].slice(0, (grid * grid) / 2)
        : Array.from({ length: (grid * grid) / 2 }, (_, i) => `${i + 1}`);

    const all = [...detail, ...detail]
      .map((val, i) => ({ id: i, value: val, flipped: true, matched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(all);
    setScores(Array(players).fill(0));
    setCurrentPlayer(0);
    setTime(0);
    setMoves(0);
    setTimerActive(false);

    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, flipped: false })));
      setTimerActive(true);
    }, 1200);

    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
    setGameOver(false);
  };

  const handleClick = (index: number) => {
    if (lockBoard || cards[index].flipped || cards[index].matched) return;

    const newCard = [...cards];
    newCard[index].flipped = true;
    setCards(newCard);

    if (firstCard === null) {
      setFirstCard(index);
    } else if (secondCard === null) {
      setSecondCard(index);
      setLockBoard(true);
      setMoves((prev) => prev + 1);
    }
    const first = firstCard;
    const second = index;
    if (first !== null && cards[first].value === cards[second].value) {
      newCard[first].matched = true;
      newCard[second].matched = true;
      setCards(newCard);
      setScores((prev) =>
        prev.map((score, idx) => (idx === currentPlayer ? score + 1 : score))
      );

      resetTurn(false);
    } else if (first !== null) {
      setTimeout(() => {
        newCard[first].flipped = false;
        newCard[second].flipped = false;
        setCards([...newCard]);
        resetTurn(true);
      }, 1000);
    }
  };

  const resetTurn = (switchTurn = true) => {
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
    if (switchTurn) {
      setCurrentPlayer((prev) => (prev + 1) % players);
    }
  };
  const restart = () => {
    initializeGame();
    setMenu(false);
  };
  const goToMenu = () => {
    setView("mode");
    setScores(Array(players).fill(0));
    setTime(0);
    setMoves(0);
    setGameOver(false);
    setCurrentPlayer(0);
    setMenu(false);
  };
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  };
  const winners = scores.reduce<number[]>(
    (acc, score, i) => (score === maxScore ? [...acc, i] : acc),
    []
  );
  const isTie = winners.length > 1;
  return (
    <AnimatePresence>
      {view === "mode" && (
        <motion.main key="settings">
          <SelectFormat
            setTheme={setTheme}
            setPlayers={setPlayers}
            setSize={setSize}
            setView={setView}
            size={size}
            players={players}
            theme={theme}
          />{" "}
        </motion.main>
      )}
      {view === "game" && (
        <motion.main
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="gameContainer">
            <header>
              <h4>memory</h4>
              {width < 600 ? (
                <div className="menu" onClick={() => setMenu(true)}>
                  Menu
                </div>
              ) : (
                <div className="btns">
                  <button onClick={restart} className="restart">
                    Restart
                  </button>
                  <button onClick={goToMenu} className="new">
                    New Game
                  </button>
                </div>
              )}
            </header>

            <div
              className={`cards grid`}
              style={{
                gridTemplateColumns: `repeat(${parseInt(
                  size
                )}, minmax(16px, 1fr))`,
              }}
            >
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleClick(index)}
                  className={`card ${
                    card.flipped || card.matched ? "flipped" : ""
                  } ${card.matched ? "matched" : ""}  ${
                    size === "6x6" ? "cardLarge" : "cardSmall"
                  }`}
                >
                  <div className="inner">
                    <div className="front"></div>
                    <div className="back">
                      {typeof card.value === "object" &&
                      "iconName" in card.value ? (
                        <FontAwesomeIcon icon={card.value} />
                      ) : typeof card.value === "function" ? (
                        React.createElement(card.value)
                      ) : (
                        card.value
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {players === 1 ? (
              <div className="timerAndMove">
                <div className="timer">
                  <p>Time</p>
                  <h5>{formatTime(time)}</h5>{" "}
                </div>
                <div className="move">
                  <p>Moves</p>
                  <h5>{moves}</h5>
                </div>
              </div>
            ) : (
              <div className="timerAndMove playerMoves">
                {scores.map((score, i) => (
                  <div
                    key={i}
                    className={`move ${
                      i === currentPlayer ? "active" : ""
                    } playerMove`}
                  >
                    <p>
                      {width < 600 ? "P" : "Player"} <span>{i + 1}</span>
                    </p>
                    <h5>{score}</h5>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.main>
      )}
      {gameOver && (
        <motion.div
          className="overlay"
          key="gameOver"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {players === 1 ? (
            <div className="overlayContent">
              <div className="overlayHeader">
                <h2>You did it!</h2>
                <p>Game over! Here’s how you got on…</p>
              </div>
              <div className="overLayMain">
                <div className="timerAndMove">
                  <div className="timer">
                    <p>Time Elapsed</p>
                    <h5>{formatTime(time)}</h5>{" "}
                  </div>
                  <div className="move">
                    <p>Moves Taken</p>
                    <h5>{moves} Moves</h5>
                  </div>
                </div>
              </div>
              <div className="btns">
                <button onClick={restart} className="restart">
                  Restart
                </button>
                <button onClick={goToMenu} className="new">
                  Setup New Game
                </button>
              </div>
            </div>
          ) : (
            <div className="overlayContent">
              <div className="overlayHeader">
                <h2>
                  {isTie ? `It’s a tie!` : `Player ${winners[0] + 1} Wins!`}
                </h2>
                <p>Game over! Here are the results…</p>
              </div>
              <div className="overLayMain">
                <div className="timerAndMove">
                  {scores.map((score, i) => (
                    <div
                      key={i}
                      className={`playerResult ${
                        winners.includes(i) ? "winner" : ""
                      }`}
                    >
                      <p>
                        Player {i + 1} {winners.includes(i) && "(Winner!)"}
                      </p>
                      <h5>
                        {score} {score === 1 ? "Pair" : "Pairs"}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
              <div className="btns">
                {" "}
                <button onClick={restart} className="restart">
                  Restart
                </button>
                <button onClick={goToMenu} className="Mnew">
                  Setup New Game
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
      {menu && width < 600 && (
        <motion.div
          className="overlay"
          key="menu"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlayBtns" ref={menuRef}>
            <button onClick={restart} className="restart">
              Restart
            </button>
            <button onClick={goToMenu} className="new">
              New Game
            </button>
            <button onClick={() => setMenu(false)} className="new">
              Resume Game
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
