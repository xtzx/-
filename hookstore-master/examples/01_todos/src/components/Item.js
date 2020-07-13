import React from 'react';

import { getStore, useStatus } from 'hookstore';

export default ({ id, status, text }) => {
  const [, actions] = getStore('todos');
  const { pending } = useStatus('todos/delete');
  const done = status === 1;
  const cls = done ? 'done' : 'undo';

  return (
    <li className={cls}>
      <input type="checkbox" checked={done} onChange={() => actions.toggle(id)} />
      {text}
      <button onClick={() => actions.delete(id)}>delete</button>
      {pending && <span>...</span>}
    </li>
  );
};
