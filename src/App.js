// Steps:

// Step 1: Read the code and understand what it is doing. It is essentially
// creating a simulation of https://leetcode.com/problems/game-of-life/.

// Step 2: Write the nextGen function. There are notes in the function
// on what it is supposed to do. It is essentially the logic for the game of life.

// Step 3: Write the function pauseSimulation, randomize, and clearBoard.
// There are some comments for some hints on what that is supposed to do.

import React from "react";
import "./styles.css";
import gliderGunAndPulsars from "./originalPattern.js";

// coded by @no-stack-dub-sack
// modified by Shums into a Challenge
var neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];
class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBoard: gliderGunAndPulsars,
      generation: 0,
      running: false,
      intervalId: "",
      showPatterns: false
    };
    this.createBoard = this.createBoard.bind(this);
    this.beginSimulation = this.beginSimulation.bind(this);
    this.nextGen = this.nextGen.bind(this);
    this.pauseSimulation = this.pauseSimulation.bind(this);
    this.randomize = this.randomize.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.convertToOneDimension = this.convertToOneDimension.bind(this);
    this.clickChanger = this.clickChanger.bind(this);
  }

  componentDidMount() {
    this.beginSimulation();
  }

  // creates blank or randomized board
  // need blank board first before creating
  // pattern with below function
  createBoard(cells) {
    let config = [];
    for (let i = 0; i < 30; i++) {
      config.push([]);
      for (let j = 0; j < 50; j++) {
        if (cells === "randomize") {
          config[i].push(Math.random() < 0.5 ? 0 : 1);
        } else {
          config[i].push(cells);
        }
      }
    }
    return config;
  }

  // is called at initial rendering (and from restart button),
  // thus calling nextGen() at 500ms intervals until user
  // clears interval with pause or restart buttons
  beginSimulation() {
    if (this.state.running) return;
    this.setState({
      intervalId: setInterval(() => {
        if (this.state.running) this.nextGen();
      }, 500)
    });
  }

  nextGen() {
    let row, col, r, c, neighbor_counter;
    let rows = this.state.currentBoard.length;
    let cols = this.state.currentBoard[0].length;
    let newBoard = this.state.currentBoard;
    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        neighbor_counter = 0;
        neighbors.forEach((neighbor) => {
          r = row + neighbor[0];
          c = col + neighbor[1];
          if (
            r < rows &&
            r >= 0 &&
            c < cols &&
            c >= 0 &&
            this.state.currentBoard[r][c] === 1
          )
            neighbor_counter++;
        });

        if (
          this.state.currentBoard[row][col] === 1 &&
          (neighbor_counter > 3 || neighbor_counter < 2)
        )
          newBoard[row][col] = 0;

        if (this.state.currentBoard[row][col] === 0 && neighbor_counter === 3)
          newBoard[row][col] = 1;
      }
    }
    this.setState({ currentBoard: newBoard });
    this.setState({ generation: this.state.generation + 1 });
  }

  pauseSimulation() {
    this.setState({ running: !this.state.running });
  }

  randomize() {
    this.setState({ running: false });
    this.setState({ generation: 0 });
    let row, col, randomNum;
    let newBoard = this.state.currentBoard;
    for (row = 0; row < this.state.currentBoard.length; row++) {
      for (col = 0; col < this.state.currentBoard[0].length; col++) {
        newBoard[row][col] = 0;
        randomNum = Math.floor(Math.random() * 101);
        if (randomNum > 80) newBoard[row][col] = 1;
      }
    }
    this.setState({ currentBoard: newBoard });
  }

  clearBoard() {
    this.setState({ running: false });
    this.setState({ generation: 0 });
    let newBoard = this.state.currentBoard;
    let row, col;
    for (row = 0; row < this.state.currentBoard.length; row++) {
      for (col = 0; col < this.state.currentBoard[0].length; col++) {
        newBoard[row][col] = 0;
      }
    }
    this.setState({ currentBoard: newBoard });
  }

  convertToOneDimension(multiDimArray) {
    // Converts multi-dim representation of board into a
    // single dimension array than can easily be drawn by the
    // render function.
    let oneDimensional = [];
    multiDimArray.forEach((row) => {
      row.map((cell) => {
        return oneDimensional.push(cell);
      });
    });
    return oneDimensional;
  }

  clickChanger(e) {
    // pass key, get row and column coords
    // update that index to alive or dead
    // according to current state of cell
    let id = e.target.id;
    let el = document.getElementById(id);
    let color = window.getComputedStyle(el).getPropertyValue("background");
    let row = Math.floor(id / 50);
    let col = id % 50;
    let update = this.state.currentBoard;
    if (color.includes("rgb(0, 0, 0)")) {
      update[row][col] = 1;
    } else {
      update[row][col] = 0;
    }
    this.setState({
      currentBoard: update
    });
  }

  render() {
    const dead = { background: "black" };
    const alive = { background: "#66ff33" };
    const board = this.convertToOneDimension(this.state.currentBoard);
    const drawBoard = board.map((cell, i) => {
      let color = cell === 0 ? dead : alive;
      return (
        <div
          id={i}
          onClick={this.clickChanger}
          className="cell"
          style={color}
          key={i}
        ></div>
      );
    });

    return (
      <div>
        <div className="title">Conway's Game of Life</div>
        <GameBoard create={drawBoard} />
        <div className="bottomTab">
          <Counter count={this.state.generation} />
          <Controls
            handleClick={this.pauseSimulation}
            label="Start/Pause/Resume"
            tooltip="Press pause whie a simulation is running, click on some cells, and see what happens when you resume!"
          />
          <Controls handleClick={this.randomize} label="Randomize" />
          <Controls
            handleClick={this.clearBoard}
            label="Clear Board"
            tooltip="Clear the board and click on the cells to make your own patterns!"
          />
        </div>
      </div>
    );
  }
}

// STATELESS COMPONENTS:
class GameBoard extends React.Component {
  render() {
    return (
      <div className="boardWrapper">
        <div className="board">{this.props.create}</div>
      </div>
    );
  }
}

class Controls extends React.Component {
  render() {
    return (
      <div
        onClick={this.props.handleClick}
        title={this.props.tooltip}
        className={this.props.class}
      >
        {this.props.label}
      </div>
    );
  }
}

class Counter extends React.Component {
  render() {
    return (
      <div className="counter">
        Genreation: <div>{this.props.count}</div>
      </div>
    );
  }
}

export default GameOfLife;
