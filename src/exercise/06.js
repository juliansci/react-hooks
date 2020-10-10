import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PokemonForm, PokemonInfoFallback, PokemonDataView, fetchPokemon } from '../pokemon'

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

function PokemonInfoErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({ pokemonName }) {
  const [state, setState] = useState({ status: STATUS.IDLE, pokemon: null, error: {} });
  const { status, pokemon, error } = state;
  console.log(state);
  useEffect(() => {
    if (!pokemonName) {
      setState(state => ({ ...state, status: STATUS.IDLE }))
      return;
    };
    setState(state => ({ ...state, pokemon: null, status: STATUS.PENDING }))
    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setState(state => ({ ...state, pokemon: pokemonData, status: STATUS.RESOLVED }))
        },
        error => {
          setState(state => ({ ...state, error, status: STATUS.REJECTED }))
        }
      )
  }, [pokemonName]);
  let response = null;
  switch (status) {
    case STATUS.PENDING:
      response = <PokemonInfoFallback name={pokemonName} />;
      break;
    case STATUS.RESOLVED:
      response = <PokemonDataView pokemon={pokemon} />;
      break;
    case STATUS.REJECTED:
      throw error;
    default:
      response = 'Submit a Pokemon';
      break;
  }
  return response;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={PokemonInfoErrorFallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>

      </div>
    </div>

  )
}

export default App
