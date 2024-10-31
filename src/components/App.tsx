import { useState, useEffect} from "react"
import { IComment } from "../types/types"
import axios from 'axios'
import style from './styles/UserList.module.css'

const App = () => {
  const [comments, setComments] = useState<IComment[]>([])
  const [curPage, setCurPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [editItemID, setEditItemID] = useState(null)
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [CommentBody, setCommentBody] = useState('');


  useEffect (() => {
    document.addEventListener('scroll', scrollHandler)

    return function () {
    document.removeEventListener('scroll', scrollHandler)
  }
})

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 200) {
      setFetching(true)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetching])

   async function fetchUsers() {
    try {
      let url: string = "https://jsonplaceholder.typicode.com/comments?_limit=10&_page=" + curPage.toString()
      const response = await axios.get<IComment[]>(url)
      setComments([...comments, ...response.data])
      setCurPage(prevState => prevState + 1)
      setFetching(false)
    } catch (e) {
      alert(e)
    }
   }

   const deleteItem = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
    if (editItemID === id) {
      setEditItemID(null);
    }
  };

  const handleSubmit = (e) => {
    const form = document.getElementById(editItemID + 'form')
    form.style.display = 'none'
    e.preventDefault()
    if (commentName.trim() !== '' && commentEmail.trim() !== '' && CommentBody.trim() !== '') {
      if (editItemID !== null) {
        const updatedComments = comments.map(comment => {
          if (comment.id === editItemID) {
            return {
              ...comment,
              name: commentName,
              email: commentEmail,
              body: CommentBody
            }
          }
          return comment
        })
        setComments(updatedComments)
        setEditItemID(null)
      }
    }
  }
   const editItem = (id) => {
    const form = document.getElementById(id + 'form')
    form.style.display = 'flex'
    const commentToEdit = comments.find(comment => comment.id === id)
    if (commentToEdit) {
      setCommentName(commentToEdit.name);
      setCommentEmail(commentToEdit.email);
      setCommentBody(commentToEdit.body);
      setEditItemID(id);
    }
   }

  const handleChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case 'name':
          setCommentName(value)
          break;
      case 'email':
          setCommentEmail(value)
          break;
      case 'body':
          setCommentBody(value)
          break  
      default: break        
    }
  }


  return (
    <div className={style.list}>
            {comments.map(comment =>   
                <div key={comment.id}>
                <div className={style.comment}>
                    <ul className={style.data}>
                        <li className={style.elem}>{comment.id}</li>
                        <li className={style.elem}>{comment.name}</li>
                        <li className={style.elem}>{comment.email}</li>
                    </ul>
                    <p>{comment.body}</p>
                    <button type="button" className={style.button} id={comment.id.toString()} onClick={() => editItem(comment.id)}>Редактировать</button>
                    <button type="button" className={style.button} key={comment.id} id={comment.id.toString()} onClick={() => deleteItem(comment.id)}>Удалить</button>
                    <form id={comment.id.toString() + 'form'} action="" onSubmit={handleSubmit} className={style.form}>
                      <input className={style.input} type="text" name="name" defaultValue={comment.name} onChange={handleChange}/>
                      <input className={style.input} type="text" name="email" defaultValue={comment.email} onChange={handleChange}/>
                      <textarea className={style.textarea} rows="4" name="body" defaultValue={comment.body} onChange={handleChange}></textarea>
                      <button type="submit" className={style.button}>Сохранить</button>
                    </form>
                </div>
            </div>
            )}
        </div>
  )
}

export default App;
