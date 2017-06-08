import React, { Component } from 'react';
import Button from 'react-toolbox/lib/button/Button';

import Board from './Board'
import NavbarContainer from './NavbarContainer';
import BoardModalContainer from './BoardModalContainer';
import { getBoards, deleteBoard } from '../utils/APIHandler';

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


  renderBoards = (boards = []) => {
    return boards.map(({ boardName, separator, counter, boardTrelloID }) => {
      return (
        <Board
          key={boardTrelloID}
          id={boardTrelloID}
          name={boardName}
          separator={separator}
          counter={counter}
          deleteMe={() => deleteBoard(boardTrelloID)}
        />
      );
    })
  }


  render() {
    const { apiKey, boards, showModal } = this.state;

    return (
      <div>
        <NavbarContainer apiKey={apiKey} />
        {
          showModal &&
          <BoardModalContainer closeModal={() => this.setShowModal(false)} />
        }
        <div className='board-container'>
          {this.renderBoards(boards)}
        </div>
        <Button className='bt-br btn' icon='add' floating onClick={() => this.setShowModal(true)}/>
      </div>
    );
  }
}
