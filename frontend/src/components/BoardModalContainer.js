import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BoardModal from './BoardModal';
import { getMyBoards, createNewCounter } from '../utils/APIHandler';

export default class BoardModalContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      boards: []
    };
  }


  componentDidMount() {
    getMyBoards()
    .then((boards) => {
      const sourceBoards = boards.map(board => ({ value: board.id, label: board.name }));
      this.setState({ boards: sourceBoards });
    });
  }


  onSubmit = (newCounter) => {
    const { addBoardAndClose } = this.props;

    createNewCounter(newCounter)
    .then((res) => { addBoardAndClose(newCounter); });
  }


  render() {
    const {
      props: { closeModal },
      state: { boards },
      onSubmit
    } = this;

    return <BoardModal boards={boards} onSubmit={onSubmit} closeModal={closeModal} />;
  }
}


BoardModalContainer.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addBoardAndClose: PropTypes.func.isRequired
}
