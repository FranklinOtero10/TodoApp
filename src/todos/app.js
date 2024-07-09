import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementsIDs = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilter: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */

export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(ElementsIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementsIDs.PendingCountLabel);
    }

    // Cuando la funcion se llama
    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos();
    })();

    // Referencias HTML
    const newDescriptionInput = document.querySelector( ElementsIDs.NewTodoInput );
    const todosLisUL = document.querySelector( ElementsIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementsIDs.ClearCompletedButton );
    const filtersLIs = document.querySelectorAll( ElementsIDs.TodoFilter );

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if ( event.keyCode !== 13 ) return;
        if ( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = ''
    });

    todosLisUL.addEventListener('click', (event)  => {
        const element = event.target.closest( '[data-id]' );
        todoStore.toggleTodo( element.getAttribute('data-id') );
        displayTodos();
    });

    todosLisUL.addEventListener('click', (event)  => {
        const isDestroyedElement  = event.target.className === 'destroy';
        const element = event.target.closest( '[data-id]' );
        if (!element || !isDestroyedElement) return;
        
        todoStore.deleteTodo( element.getAttribute('data-id') );
        displayTodos(); 
    });

    clearCompletedButton.addEventListener('click', ()  => {
        todoStore.deleteCompleted();
        displayTodos(); 
    });

    filtersLIs.forEach( element => {
        element.addEventListener('click', (element) => {
            filtersLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All )
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending )
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed )
                    break;                            
            }
            displayTodos();
        });
    });
}