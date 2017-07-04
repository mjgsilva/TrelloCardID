import React, { Component } from 'react';
import Button from 'react-toolbox/lib/button/Button';

import Board from './Board';
import NavbarContainer from './NavbarContainer';
import BoardModalContainer from './BoardModalContainer';
import Graph from './Graph';
import BoardActivity from './BoardActivity';
import { getBoards, deleteBoard } from '../utils/APIHandler';
import { removeArr, changeDates } from '../utils/ArrayHelpers';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: null,
      boards: [],
      stats: [],
      recentEntries: [],
      showModal: false
    };
  }

  componentDidMount() {
    getBoards().then(({ accessToken, counters, stats, recentEntries }) => {
      this.setInfo(
        accessToken,
        counters,
        changeDates(stats),
        recentEntries.reverse()
      );
    });
  }

  setInfo = (accessToken, boards, stats, recentEntries) => {
    this.setState({ apiKey: accessToken, boards, stats, recentEntries });
  };

  setShowModal = showModal => {
    this.setState({ showModal });
  };

  addBoardAndClose = newBoard => {
    this.setState(prevState => {
      return {
        boards: [...prevState.boards, newBoard],
        showModal: false
      };
    });
  };

  removeBoard = idx => {
    this.setState(prevState => {
      return {
        boards: removeArr(prevState.boards, idx)
      };
    });
  };

  deleteMe = (boardTrelloID, idx) => {
    deleteBoard(boardTrelloID).then(() => {
      this.removeBoard(idx);
    });
  };

  renderBoards = (boards = []) => {
    return boards.map(
      ({ boardName, separator, counter, boardTrelloID, prefix }, idx) => {
        return (
          <Board
            key={idx}
            id={boardTrelloID}
            name={boardName}
            separator={separator}
            counter={counter}
            prefix={prefix}
            deleteMe={() => this.deleteMe(boardTrelloID, idx)}
          />
        );
      }
    );
  };

  render() {
    const {
      state: { apiKey, boards, stats, recentEntries, showModal },
      setShowModal,
      renderBoards,
      addBoardAndClose
    } = this;

    return (
      <div>
        <NavbarContainer apiKey={apiKey} />
        {showModal &&
          <BoardModalContainer
            addBoardAndClose={newBoard => addBoardAndClose(newBoard)}
            closeModal={() => setShowModal(false)}
          />}
        <div className="board-container">
          <p className="title">Boards</p>
          <div className="boards-wrapper mb-40">
            {renderBoards(boards)}
          </div>
          <p className="title">Cards Processed</p>
          <div className="graph-wrapper mb-40">
            <Graph stats={stats} />
          </div>
          <p className="title">Board Activity</p>
          <div className="activity-wrapper mb-40">
            <BoardActivity activity={recentEntries} />
          </div>
        </div>
        <Button
          className="bt-br btn"
          icon="add"
          floating
          onClick={() => setShowModal(true)}
        />
      </div>
    );
  }
}
