import React from 'react';
import Button from 'react-toolbox/lib/button/Button';

const Board = ({ name, separator, counter, id, deleteMe }) => {
  console.log(name, separator, counter, id)
  return (
    <div className='card'>
      <Button className='card-close' icon='close' floating accent onClick={deleteMe} />
      <div className='card-title text-center'>{name}</div>
      <div className='card-info'>
        <div className='card-info-item'>
          <p className='card-info-item-description'>Separator</p>
          <p>{separator}</p>
        </div>
        <div className='card-info-item'>
          <p className='card-info-item-description'>Counter</p>
          <p>{counter}</p>
        </div>
      </div>
    </div>
  );
}

export default Board;
