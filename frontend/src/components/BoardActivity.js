import React from 'react';
import moment from 'moment';

const BoardActivity = ({ activity }) => {
  return (
    <div className="activity-table">
      {activity.map(({ createdAt, counter }, idx) =>
        <div className="table-wrapper" key={idx}>
          <div className="box date">
            {moment(createdAt).format('DD MMM, HH:mm')}
          </div>
          <div className="box fow-300">
            A new card updated on{' '}
            <span className="board-name">{counter.boardName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardActivity;
