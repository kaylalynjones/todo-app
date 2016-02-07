import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  actions as todoActions,
  constants as todoConstants
} from 'redux/modules/todos';
import AddTodo from 'components/AddTodo/AddTodo';
import TodoList from 'components/TodoList/TodoList';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import ToggleBar from 'components/ToggleBar/ToggleBar';
import classes from './HomeView.scss';

export class HomeView extends React.Component {
  render () {
    const {
      dispatch,
      todos,
      filter,
      progress
    } = this.props;

    return (
      <div className={classes['home-view'] + ' view'}>
        <div className='wrapper'>
          <ToggleBar
            currentFilter={filter}
            onToggleFilter={filter => dispatch(todoActions.toggleListFilter(filter))}
          />
          <ProgressBar progress={progress} />
          <TodoList todos={todos}
            onToggleTodo={id => dispatch(todoActions.toggleTodo(id))}
            onRemoveTodo={id => dispatch(todoActions.removeTodo(id))}
            onMoveTodo={(from, to) => dispatch(todoActions.moveTodo(from, to))}
          />
          <footer className='hide-on-tablet'>
            <AddTodo onAddTodo={text => dispatch(todoActions.addTodo(text)) }/>
          </footer>
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  filter: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })).isRequired,
  progress: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

const selectProgress = todos => {
  if (!todos.length) return 0;

  let done = todos.filter((t) => t.completed);
  return (done.length / todos.length) * 100;
};

const selectTodos = (todos, filter) => {
  switch (filter) {
    case todoConstants.LIST_FILTERS.SHOW_COMPLETE:
      return todos.filter(t => t.completed);
    case todoConstants.LIST_FILTERS.SHOW_INCOMPLETE:
      return todos.filter(t => !t.completed);
    case todoConstants.LIST_FILTERS.SHOW_ALL:
      return todos;
  }
};

const mapStateToProps = state => {
  return {
    filter: state.filter,
    todos: selectTodos(state.todos, state.filter),
    progress: selectProgress(state.todos)
  };
};

export default connect(mapStateToProps)(HomeView);
