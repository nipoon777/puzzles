import { useEffect, useState } from "react";
import { getTodayFormattedString } from "../../../util/util";
import GameFooterContent from "../../GameFooterContent";
import MultiPuzzleIndicator from "../../util/MultiPuzzleIndicator";

import './Figure.css';

const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = '×';
const DIVIDE = '÷';
const OPERATORS = [ADD, SUBTRACT, MULTIPLY, DIVIDE];

function FigureValue(props) {
    const { value, onClick, selected, target } = props;

    const style = {};
    if (selected) {
        style.backgroundColor = '#f7ff66';
    };

    if (value === target) {
        style.backgroundColor = '#54c248';
    }

    if (value === null) {
        style.backgroundColor = 'transparent';
        style.border = '2px solid transparent';
        style.cursor = 'inherit';
    }

    function handleClick() {
        if (value !== null) {
            onClick();
        }
    }

    return (
        <div className='figure-number' style={style} onClick={handleClick}>
            {value !== null && value}
        </div >
    );
}

function Operator(props) {
    const { operator, onClick, selected } = props;

    const style = {};
    if (selected) {
        style.backgroundColor = '#f7ff66';
    };

    return (
        <span className='figure-operator' style={style} onClick={onClick}>
            {operator}
        </span>
    );
}

export default function Figure() {

    const [puzzles, setPuzzles] = useState(null);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedNumberIndex, setSelectedNumberIndex] = useState(null);
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [isFirstActionTaken, setIsFirstActionTaken] = useState(false);

    useEffect(fetchPuzzles, []);

    function fetchPuzzles() {
        fetch('/daily_puzzles/figures.json')
        .then(res => res.json())
        .then(data => {
            const today = getTodayFormattedString();
            const todayPuzzles = data[today];
            if (todayPuzzles === undefined) {
                setError("Today's puzzle is not yet available.");
                return;
            }
            setPuzzles(todayPuzzles);
        })
        .catch(() => {
            setError("Could not load today's puzzle.");
        });
    }

    function handleValueClick(index) {

        if (selectedNumberIndex === index) {
            setSelectedNumberIndex(null);
            setSelectedOperator(null);
            return;
        }

        if (selectedOperator !== null) {
            // TODO: Perform arithmetic.
            const firstValue = values[selectedNumberIndex];
            const secondValue = values[index];

            if (selectedOperator === DIVIDE && firstValue % secondValue !== 0) {
                setSelectedNumberIndex(null);
                setSelectedOperator(null);
                return;
            }

            const newValue = (
                selectedOperator === ADD ? firstValue + secondValue :
                selectedOperator === SUBTRACT ? firstValue - secondValue :
                selectedOperator === MULTIPLY ? firstValue * secondValue :
                firstValue / secondValue
            );

            setValues(values.map((value, i) => (
                i === index ? newValue :
                i === selectedNumberIndex ? null :
                value
            )));
            setSelectedOperator(null);
            setSelectedNumberIndex(index);
            setIsFirstActionTaken(true);
            return;
        }

        setSelectedNumberIndex(index);
    }

    function handleOperatorClick(operator) {
        if (selectedNumberIndex === null) {
            return;
        }
        if (selectedOperator === operator) {
            setSelectedOperator(null);
            return;
        }
        setSelectedOperator(operator);
    }

    function proceedToNextPuzzle() {
        setValues([]);
        setIsFirstActionTaken(false);
        setSelectedNumberIndex(null);
        setResults([...results, true]);
    }

    function resetPuzzle() {
        setValues([]);
        setSelectedNumberIndex(null);
        setSelectedOperator(null);
        setIsFirstActionTaken(false);
    }

    function renderError() {
        return (
            <div>
                {error}
            </div>
        )
    }

    function renderPuzzle() {
        if (!puzzles) {
            return;
        }

        const numPuzzles = puzzles.length;
        const currentPuzzle = puzzles[results.length];

        if (values.length === 0) {
            setValues(currentPuzzle.values);
        }

        const isPuzzleSolved = values.includes(currentPuzzle.target);

        return (
            <div>
                <MultiPuzzleIndicator
                    results={results}
                    total={numPuzzles}
                />
                <h2>{currentPuzzle.target}</h2>

                <div className='flex'>
                    {values.map((value, i) => (
                        <FigureValue
                            key={i}
                            value={value}
                            selected={selectedNumberIndex === i}
                            onClick={() => !isPuzzleSolved && handleValueClick(i)}
                            target={currentPuzzle.target}
                        />
                    ))}
                </div>
                <div>
                    {OPERATORS.map((operator, i) => (
                        <Operator
                            key={i}
                            operator={operator}
                            selected={selectedOperator === operator}
                            onClick={() => !isPuzzleSolved && handleOperatorClick(operator)}
                        />
                    ))}
                </div>

                {isPuzzleSolved &&
                    <div className='figure-next-puzzle-btn' onClick={proceedToNextPuzzle}>
                        Puzzle solved! {results.length + 1 < numPuzzles && 'Next puzzle.'}
                    </div>
                }

                { isFirstActionTaken && !isPuzzleSolved &&
                    <button onClick={resetPuzzle}>Reset puzzle</button>
                }
            </div>
        );
    }

    const allPuzzlesCompleted = results !== null && puzzles !== null && results.length === puzzles.length;

    function renderCompletionMessage() {
        return (
            <div>
                You've solved all of today's puzzles! Check back tomorrow for more.
            </div>
        );
    }

    return (
        <div>
            <h1>Figure</h1>
            { error ? renderError() : allPuzzlesCompleted ? renderCompletionMessage() : renderPuzzle() }
            <GameFooterContent />
        </div>
    );
}
