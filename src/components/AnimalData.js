import React, { useEffect, useState } from 'react';
import './App.css'
export default function AnimalData() {
    const [name, setName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [description, setDescription] = useState('')
    const [AnimalData, setAnimalsData] = useState([])

    useEffect(() => {
        fetch('https://dogdata.onrender.com/animalsData')
            .then((res) => res.json())
            .then((animalArray) => {
                setAnimalsData(animalArray)
            })
    }, []);

    function handleAddANimal(event) {
        event.preventDefault();

        let animalObj = {
            name: name,
            imageUrl: imageUrl,
            description: description,
            donations: 0
        };

        fetch(`https://dogdata.onrender.com/animalsData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(animalObj)
        })
            .then((res) => res.json())
            .then((data) => setAnimalsData([...AnimalData, data]))

        setName('');
        setImageUrl('');
        setDescription('')
    };

    function handleUpdateDonations(id) {
        const animalToUpdate = AnimalData.find(animal => animal.id === id);
        const updatedAnimal = {
            ...animalToUpdate,
            donations: animalToUpdate.donations + 10
        };

        fetch(`https://dogdata.onrender.com/animalsData/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAnimal)
        }).then((res) => res.json())
            .then(data => setAnimalsData(AnimalData.map(animal => animal.id === id ? animal : data)))
    }

    function handleDeleteAnimal(id) {
        fetch(`https://dogdata.onrender.com/animalsData/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => res.json())
            .then(() => setAnimalsData(AnimalData.filter(animal => animal.id !== id)))
    }

    return (
        <div>
            <div>
                <h1>Animals Data:</h1>
                <form onSubmit={handleAddANimal}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                    </label>
                    <label>
                        Image URL:
                        <input type="text" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
                    </label>
                    <label>
                        Description:
                        <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
                    </label>
                    <button type="submit">Add Animal</button>
                </form>
                <ul>
                    {AnimalData.map(animal => (
                        <li key={animal.id}>
                            <img src={animal.imageUrl} className="dog" alt={animal.name} width="200" height="200" />
                            <h2>{animal.name}</h2>
                            <p>{animal.description}</p>
                            <p>Donations: {animal.donations}</p>
                            <div className='buttons'>
                                <button onClick={() => handleUpdateDonations(animal.id)}>Donate</button>
                                <button onClick={() => handleDeleteAnimal(animal.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}