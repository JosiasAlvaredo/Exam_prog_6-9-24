import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', mail: '' });

    useEffect(() => {
        axios
            .get('http://localhost:3000/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!newUser.name || !newUser.mail) {
            setError('Porfavorsito no deje ningun input vacio');
            return;
        }
        axios
            .post('http://localhost:3000/users', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setNewUser({ name: '', mail: '' });
            })
            .catch(error => {
                setError(error);
            });
    };

    const handleChange = mail => {
        axios
            .put(`http://localhost:3000/users/${mail}`)
            .then(() => {
                setUsers(users.filter(user => user.mail !== mail));
            })
            .catch(error => {
                setError(error);
                console.log(error);
            });
    };

    const handleDelete = id => {
        axios
            .delete(`http://localhost:3000/users/${id}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
                console.log(`Usuario eliminado`);
            })
            .catch(error => {
                setError(error);
                console.log(error);
            });
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='App'>
            <div className='centar'>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" className='nombre' value={newUser.name} onChange={(event) => setNewUser({ ...newUser, name: event.target.value })} />
                </label>
                <br />
                <label>
                    Mail:
                    <input type="email" className='email' value={newUser.mail} onChange={(event) => setNewUser({ ...newUser, mail: event.target.value })} />
                </label>
                <br />
                <button type="submit">Añadir Usuario</button>
            </form>
            </div>
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Mail</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.mail}</td>
                            <td>
                                <button onClick={() => handleChange(user.mail)}>Editar</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default UserList;
