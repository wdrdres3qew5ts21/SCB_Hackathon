import React, { Component } from 'react'
import styled from 'styled-components'
import { Color } from '../utils'

const Container = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 52.6%, ${() => Color.secondary} 100%), ${() => Color.primary};
`


export default class extends Component {
  state = {

  }

  componentDidMount() {
    // MARK: Check Token
  }

  render() {
    return (
      <Container>
        <div>wtf</div>
      </Container>
    )
  }
}