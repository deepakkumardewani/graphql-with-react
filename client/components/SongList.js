import React, { Component } from 'react'
import '../style/style.css'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router'
import query from '../queries/fetchSongs'

class SongList extends Component {

  onSongDelete(id) {
    this.props.mutate({ variables: { id } })
      .then(() => this.props.data.refetch())
  }

  renderSongs () {
    return this.props.data.songs.map(({ id, title }) => {
      return (
        <li key={id} className='collection-item'>
          <Link to={`/songs/${id}`}>{ title }</Link>
          <i onClick={() => this.onSongDelete(id)} style={{color: 'red'}} className="material-icons">delete</i>
        </li>
      )
    })
  }
  render () {
    if (this.props.data.loading) { return <div>Loading...</div> }
    return (
      <div>
        <ul className='collection'>
        { this.renderSongs() }
        </ul>
        <Link to="/songs/new" className="btn-floating btn-large red light">
          <i className="material-icons">add</i>
        </Link>
      </div>
    )
  }
}

const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id){
      id
    }
  }
`

export default graphql(mutation)(
  graphql(query)(SongList)
)