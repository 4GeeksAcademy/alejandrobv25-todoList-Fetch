import React, { useEffect, useState } from "react";


export const List = () => {

  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (user && user.name) {
      fetch(`https://playground.4geeks.com/todo/users/${user.name}`)
      .then((response) => response.json())
      .then( respJson => {
        const saveTodos = respJson.todos || [];
        setTodos(saveTodos)
      })
    }
  }, [user]);

  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/alexbaviera', {
      method: 'GET',
      header: {'content-type': 'application/json;'}
    }) 
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        return fetch('https://playground.4geeks.com/todo/users/alexbaviera', {
          method: 'POST',
          header: {'content-type': 'application/json;'}
        })
      .then((respJson)  => setUser(respJson))
      }
    })
  }, []);

  const createTodo = async (todo) => {
    await fetch('https://playground.4geeks.com/todo/todos/alexbaviera',{
      method: 'POST',
      body: JSON.stringify({
        "label": todo,
        "is_done": false
      }),
      headers: {'content-type': 'application/json;'}
    })
    .then(response => response.json())
    .then(respJson => {
      const newTodo = [...todos, respJson]
      setTodos(() => [...newTodo])
    })
  };

  const deleteTodo = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method:'DELETE',
      headers: {'contrent-type': 'application/json;'}
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error('Error al eliminar la tatrea del servidor.')
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    })
  };

  const deleteAllTodos = async () => {
    const deleteAll = todos.map(item => deleteTodo(item.id))
    await promise.all(deleteAll).then(() => setTodos([]))
  };

  const saveTodo = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      createTodo(e.target.value.trim());
      setValue(''); 
    }
  };
    return (
        <div className="container ">
            <h1>Todo List</h1>
                <input
                className="mb-3"
                value={value}
                type="text"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={saveTodo}
                />
             <ul>  
              {
                todos.map((todo, index) => (
                  <li key={index}>
                    <span>
                      {todo.label}
                    </span>
                    <i className="fa-solid fa-xmark icon" onClick={() => deleteTodo(todo.id)}></i>                  
                  </li>
                ))
              }  
            </ul>
            <i className="fa-solid fa-trash icon" onClick={() => deleteAllTodos()}></i>
        </div>


    )
}