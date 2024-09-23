import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const PokemonItem = ({ pokemonName, onDelete }) => {
	const [pokemon, setPokemon] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPokemonDetails = async () => {
			try {
				const response = await axios.get(
					`https://pokeapi.co/api/v2/pokemon/${pokemonName}`
				);
				setPokemon(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching pokemon details:', error);
				setLoading(false);
			}
		};

		fetchPokemonDetails();
	}, [pokemonName]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!pokemon) {
		return <div className='warn'>Error loading pokemon details</div>;
	}

	return (
		<li>
			<div className='PokemonItem' data-tilt data-tilt-scale='1.1'>
				<button onClick={() => onDelete(pokemon.name)} className='del'>
					<span>
						<FaTimes />
					</span>
				</button>
				<h3>{pokemon.name}</h3>
				<img src={pokemon.sprites.front_default} alt={pokemon.name} />
				<p>Формы: {pokemon.forms.map(form => form.name).join(', ')}</p>
				<p>Количество форм: {pokemon.forms.length}</p>
			</div>
		</li>
	);
};

export default React.memo(PokemonItem);
