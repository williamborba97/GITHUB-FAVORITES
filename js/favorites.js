import { GitHubeUser } from "./GithubUser.js"


//classe para conter a logica dos dados
//como os dados serão estruturados

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

   
    }

async add(username){
  try{
    const userExists = this.entries
    .find(entry => entry.login === username)

    if(userExists) {
      throw new Error ('usuario ja favoritado')
    }

    const user = await GitHubeUser.search(username)
  
     if(user.login === undefined){
      throw new Error('usuario nao encontrado')
    }
      this.entries =  [user,...this.entries]
      this.update()
      this.save()
    
    } catch(error){
    alert(error.message)
    }
 
}

load(){
this.entries = JSON.parse(localStorage.getItem
 ('@github-favorites:')) || []
}

save(){
  localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
}

delete(user){
    const filteredEntries = this.entries
    .filter(entry =>entry.login !== user.login   )

    this.entries = filteredEntries
    this.update()
    this.save()
}
}


//classe que vai criar a vizualização e eventos do HTML
export class FavoritesView extends Favorites {
   constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
   }
   
  onadd(){
  const addbutton = this.root.querySelector('.search button')
  addbutton.onclick = () => {
    const {value} = this.root.querySelector('.search input')
    this.add(value) 
  }
  }

   update(){
  this.removeAllTr()

  this.entries.forEach(user =>{
  const row = this.createRow()
  
   row.querySelector('.user img').src =  `https://github.com/${user.login}.png`  
  row.querySelector('.user img').alt = `Imagem de ${user.name}` 
  row.querySelector('.user a').href = `https://github.com/${user.login}`
  row.querySelector('.user p').textContent = user.name
  row.querySelector('.user span').textContent = user.login
  row.querySelector('.repositories').textContent = user.public_repos 
  row.querySelector('.followers').textContent = user.followers
  
  row.querySelector('.remove').onclick = () => {
    const isok =confirm('Deseja desfavoritar este usuario?')

    if(isok){
    this.delete(user)
    }
  } 
  
  this.tbody.append(row) 
 })


   }

   createRow(){
   const tr = document.createElement('tr')

   tr.innerHTML = ` 
    
    <td class="user">
      <img src="https://github.com/williamborba97.png" alt="">
      <a href="https://github.com/williamborba97" target="_blank">
       <p></p>
       <span></span> 
      </a>
    </td>
    <td class="repositories"></td>
    
    <td class="followers"></td>
    <td>
      <button class="remove">&times;</button>
    </td>`
   return tr
    
   }

   removeAllTr(){
    this.tbody.querySelectorAll('tbody tr')
    .forEach((tr) => {
    tr.remove()    
    })
   }
}