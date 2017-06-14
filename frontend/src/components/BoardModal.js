import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Input from 'react-toolbox/lib/input/Input';
import Button from 'react-toolbox/lib/button/Button';
import Dropdown  from 'react-toolbox/lib/dropdown/Dropdown';

export default class BoardModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      boardID: null,
      prefix: '',
      separator: '-',
      counter: 1
    };
  }


  setBoardID = (boardID) => {
    this.setState({ boardID });
  }


  inputHandler = (key, value) => {
    this.setState({ [key]: value });
  }


  newCounterValidator = (obj) => {
    return Object.values(obj).some((val) => val === null || val === '');
  }


  submitNewCounter = () => {
    !this.newCounterValidator(this.state) && this.props.onSubmit(this.state);
  }


  render() {
    const {
      props: { boards, closeModal },
      state: { boardID, prefix, separator, counter },
      inputHandler, setBoardID, submitNewCounter
    } = this;

    return (
      <ReactModal
         isOpen
         contentLabel='Board ID Configuration'
         className='modal'
         overlayClassName='overlay'
         onRequestClose={closeModal}
      >
        <Button className='fl-r bt-tr' icon='close' floating accent onClick={closeModal} />
        <div className='board-insert'>
          <Dropdown className='fw board-name' auto source={boards} value={boardID} onChange={setBoardID} required />
          <div className='board-insert-row'>
            <Input className='board-input' type='text' label='Prefix' name='prefix' value={prefix} onChange={(val) => inputHandler('prefix', val)} />
            <Input className='board-input' type='text' label='Separator' name='separator' value={separator} onChange={(val) => inputHandler('separator', val)} />
            <Input className='board-input' type='number' label='Counter initial value' name='prefix' value={counter} onChange={(val) => inputHandler('counter', val)} />
          </div>
          <Button className='btn' icon='done' floating onClick={submitNewCounter} />
        </div>
      </ReactModal>
    );
  }
}


BoardModal.propTypes = {
  boards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
}
