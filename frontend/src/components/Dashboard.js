import React, { Component } from 'react';
import Button from 'react-toolbox/lib/button/Button';

import Board from './Board'
import NavbarContainer from './NavbarContainer';
import BoardModalContainer from './BoardModalContainer';
import { getBoards, deleteBoard } from '../utils/APIHandler';
import { removeArr } from '../utils/ArrayHelpers';

export default class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      apiKey: null,
      boards: [],
      showModal: false
    };
  }


  componentDidMount() {
    getBoards()
    .then(({ accessToken, counters }) => {
      this.setInfo(accessToken, counters);
    });
  }


  setInfo = (accessToken, boards) => {
    this.setState({ apiKey: accessToken, boards });
  }


  setShowModal = (showModal) => {
    this.setState({ showModal });
  }


  addBoardAndClose = (newBoard) => {
    this.setState((prevState) => {
      return {
        boards: [...prevState.boards, newBoard],
        showModal: false
      };
    });
  }


  removeBoard = (idx) => {
    this.setState((prevState) => {
      return {
        boards: removeArr(prevState.boards, idx)
      };
    });
  }


  deleteMe = (boardTrelloID, idx) => {
    deleteBoard(boardTrelloID)
    .then(() => { this.removeBoard(idx); });
  }


  renderBoards = (boards = []) => {
    return boards.map(({ boardName, separator, counter, boardTrelloID, prefix }, idx) => {
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
    })
  }


  render() {
    const {
      state: { apiKey, boards, showModal },
      setShowModal, renderBoards, addBoardAndClose,
    } = this;

    return (
      <div>
        <NavbarContainer apiKey={apiKey} />
        {
          showModal &&
          <BoardModalContainer
            addBoardAndClose={(newBoard) => addBoardAndClose(newBoard)}
            closeModal={() => setShowModal(false)}
          />
        }
        <div className='board-container'>
          {renderBoards(boards)}
        </div>
        <Button className='bt-br btn' icon='add' floating onClick={() => setShowModal(true)}/>
      </div>
    );
  }
}
