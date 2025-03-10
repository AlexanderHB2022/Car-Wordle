import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/Button";

const carModels = [
  "TESLA", "CAMRY", "CIVIC", "CORSA", "MUSTANG", "PRIUS", "RANGER", "SUPRA",
  "CHEVY", "ACURA", "ARIEL", "BUICK", "CHERY", "DACIA", "DODGE", "GEELY", "HONDA",
  "ISUZU", "LEXUS", "LOTUS", "MAZDA", "SCION", "SKODA", "SMART", "VOLVO", "ACCENT",
  "ALERO", "ARIES", "ASPEN", "ATLAS", "AIXAM", "BLADE", "BRAVO", "CADDY", "COBRA",
  "COMET", "COSMO", "CROWN", "CRUZE", "DERBY", "DOBLO", "EUNOS", "EXIGE", "FABIA",
  "FLASH", "FOCUS", "FORTE", "IONIQ", "JETTA", "KICKS", "LANOS", "LASER", "LUXIO",
  "MARCH", "MEGAN", "MERAK", "MISTRA", "MOKKA", "MURAT", "OMEGA", "OPTRA", "ORION",
  "PUNTO", "SONIC", "SUPRA", "TIBUR", "TIIDA", "URBAN", "VENTO", "VITARA", "VIVIO",
  "SWIFT", "ZONDA"
];

const wordLength = 5;
const maxAttempts = 6;

const getRandomCarModel = () => carModels[Math.floor(Math.random() * carModels.length)];

export default function CarWordle() {
  const [solution, setSolution] = useState(getRandomCarModel);
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [usedLetters, setUsedLetters] = useState({});

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (gameOver) return;

      const letter = e.key.toUpperCase();

      if (currentAttempt.length < wordLength && /^[A-Z]$/.test(letter)) {
        setCurrentAttempt((prev) => prev + letter);
      }

      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyboardInput);

    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [currentAttempt, gameOver]);

  const handleBackspace = () => {
    if (gameOver || currentAttempt.length === 0) return;
    setCurrentAttempt((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (gameOver || currentAttempt.length !== wordLength) return;
    
    if (!carModels.includes(currentAttempt)) {
      setMessage("❌ Palabra no válida. Intenta con un modelo de auto válido.");
      return;
    }
    
    let newUsedLetters = { ...usedLetters };
    let result = currentAttempt.split("").map((char, idx) => {
      if (solution[idx] === char) {
        newUsedLetters[char] = "correct";
        return "correct";
      } else if (solution.includes(char)) {
        newUsedLetters[char] = newUsedLetters[char] === "correct" ? "correct" : "present";
        return "present";
      } else {
        newUsedLetters[char] = "absent";
        return "absent";
      }
    });
    
    setUsedLetters(newUsedLetters);
    setAttempts([...attempts, { word: currentAttempt, result }]);
    setCurrentAttempt("");
    setMessage("");
    
    if (currentAttempt === solution) {
      setMessage("🚗 ¡Felicidades! Adivinaste el modelo.");
      setGameOver(true);
    } else if (attempts.length + 1 >= maxAttempts) {
      setMessage(`😞 Fin del juego. La respuesta era: ${solution}`);
      setGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400">Car Wordle</h1>
      <div className="grid grid-rows-6 gap-2">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-1">
            {Array.from({ length: wordLength }).map((_, j) => (
              <motion.div
                key={j}
                className={`w-12 h-12 flex items-center justify-center text-xl font-bold border rounded-lg ${
                  attempts[i]?.result?.[j] === "correct" ? "bg-green-500 text-white" :
                  attempts[i]?.result?.[j] === "present" ? "bg-yellow-500 text-black" :
                  attempts[i]?.result?.[j] === "absent" ? "bg-gray-500 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {attempts[i]?.word[j] || (i === attempts.length ? currentAttempt[j] || "" : "")}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-lg font-semibold mt-4 text-red-400">{message}</p>
      <div className="grid grid-cols-10 gap-2 mt-4">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <Button
            key={letter}
            className={`p-2 w-10 h-10 text-lg font-bold rounded-md border ${
              usedLetters[letter] === "correct" ? "bg-green-500 text-white" :
              usedLetters[letter] === "present" ? "bg-yellow-500 text-black" :
              usedLetters[letter] === "absent" ? "bg-gray-500 text-white" : "bg-gray-800 text-white"
            }`}
            onClick={() => handleKeyPress(letter)}
            disabled={gameOver}
          >
            {letter}
          </Button>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <Button className="bg-red-500 text-white px-6 py-2 rounded-md" onClick={handleBackspace} disabled={gameOver}>⌫</Button>
        <Button className="bg-blue-500 text-white px-6 py-2 rounded-md" onClick={handleSubmit} disabled={gameOver}>✔</Button>
      </div>
    </div>
  );
}
