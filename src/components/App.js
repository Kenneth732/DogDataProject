import React, { useEffect, useState } from "react";
import './App.css'

export default function App(){
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [animalsData, setAnimalsData] = useState([])

  useEffect(() =>{
    fetch('http://localhost:3000/animalsData')
    .then(res => res.json())
    .then(data => setAnimalsData(data))
  })

  function handleAddAnimal(event){
    event.preventDefault();
    let animalObj = {
      name: name,
      imageUrl: imageUrl,
      description: description,
      donations: 0
    }
    fetch('http://localhost:3000/animalsData', {
      method: "POST",
      headers:{
        'Content-Type': "application/json"
      },
      body:JSON.stringify(animalObj)
    })
    .then(res => res.json())
    .then(data => setAnimalsData([...animalsData, data]))
    setName('')
    setImageUrl('')
    setDescription('')
  }
  function handleUpdateDonations(id){
    const animalToUpdate = animalsData.find(animal => animal.id === id)
    const updatedAnimal = {
      ...animalToUpdate,
      donations: animalToUpdate.donations + 10
    }
    fetch(`http://localhost:3000/animalsData/${id}`, {
      method: "PATCH",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(updatedAnimal)
    })
    .then(res => res.json())
    .then(data => setAnimalsData(animalsData.map(animal => animal.id === id ? data : animal)));
  }
  function handleDeleteAnimal(id){
    fetch(`http://localhost:3000/animalsData/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => setAnimalsData.filter(animal => animal.id !== id))
  }
  return(
    <div>
      <form onSubmit={handleAddAnimal}>
        <lable>
          Name: 
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </lable>
        <lable>
          imageUrl: 
          <input type="text" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
        </lable>
        <lable>
          Name: 
          <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
        </lable>
        <button type="submit">Add Animal</button>
      </form>
          <ul>
            {animalsData.map(animal => (
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
  )
}