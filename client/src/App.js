import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5500/api/item', {item: itemText}) // itemText el estado que agarro la info del input 
      setListItems(prev => [...prev, res.data]); // para mantener la info previa, es decir las tareas anteriores
      setItemText(''); // para clean el state
    }catch(err){
      console.log(err);
    }
  }

  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(()=>{
    const getItemsList = async () => {
      try{
        const res = await axios.get('http://localhost:5500/api/items') // la get 
        setListItems(res.data); // lo carga al state, que gracias a lo del post mantiene todas incluyendo las que se vayan a crear 
        console.log('render') // avisa que ya lo hizo, en consola
      }catch(err){
        console.log(err);
      }
    }
    getItemsList()
  },[]);

  // Delete item when click on delete
  const deleteItem = async (id) => { //pasale id as param pa que te lo pueda agarrar--> recibe tomandolo del onClick del delete button la UI
    try{
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      console.log(res)// agregado by Ali
      const newListItems = listItems.filter(item=> item._id !== id); // filtrar para que ya no esté rendered en la ui
      setListItems(newListItems) // enviar indeed la function de filtrado para que actualice state
    }catch(err){
      console.log(err);
    }
  }

  //Update item
  const updateItem = async (e) => {
    e.preventDefault() //ps obvio pa que no refresque la pagina
    try{
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText}) //setIsUpdating agarró el id con un onClick --> setIsUpdating(item._id) //updateItemText es lo que viene del input
      console.log(res.data)// ali le puso eso aui
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating); //agarrar el index segun el id como parecido a redux --> y dice -> aca solo agarrale el index si el id del item coincide con el que te estoy dando
      const updatedItem = listItems[updatedItemIndex].item = updateItemText; // y aca dice al item que tiene el index tal, metele el content que hay en el state
      console.log(updatedItem) /*added by ali*/
      setUpdateItemText(''); //cleaning el state
      setIsUpdating(''); //cleaning el state
    }catch(err){
      console.log(err);
    }
  }
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => {setItemText(e.target.value)} } value={itemText} />{/*setItemText es el que actualiza el state que envías a axios.post*/}
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {
          listItems.map(item => (
          <div className="todo-item">
            {
              isUpdating === item._id
              ? renderUpdateForm() // renders el form que creaste para actualizar la tarea en cuestión
              : <>
                  <p className="item-content">{item.item}</p>
                  <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button>{/* a través del onClick, agarra el id de la tarea a actualizar */}
                  <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button>
                </>
            }
          </div>
          ))
        }
        

      </div>
    </div>
  );
}

export default App;
