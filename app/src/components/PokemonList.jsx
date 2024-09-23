import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import VanillaTilt from 'vanilla-tilt';
import PokemonItem from './PokemonItem';
import { FaSearch } from 'react-icons/fa';

const PokemonList = () => {
	const [pokemons, setPokemons] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPokemons = async () => {
			try {
				const response = await axios.get(
					'https://pokeapi.co/api/v2/pokemon?limit=5'
				);
				setPokemons(response.data.results.map(pokemon => pokemon.name));
			} catch (error) {
				console.error('Error fetching pokemons:', error);
			}
		};

		fetchPokemons();
		initializeTilt();
	}, []);

	const handleSearch = useCallback(async () => {
		try {
			const response = await axios.get(
				`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
			);
			setPokemons([response.data.name, ...pokemons]);
			setError('');
			initializeTilt();
		} catch (error) {
			setError('Такой покемон не найден');
		}
	}, [searchTerm, pokemons]);

	const handleDelete = useCallback(
		name => {
			setPokemons(pokemons.filter(pokemon => pokemon !== name));
		},
		[pokemons]
	);

	const handleKeyPress = useCallback(
		e => {
			if (e.key === 'Enter') {
				handleSearch();
			}
		},
		[handleSearch]
	);

	const initializeTilt = () => {
		const elements = document.querySelectorAll('[data-tilt]');
		elements.forEach(element => {
			VanillaTilt.init(element, {
				max: 25,
				speed: 400,
				scale: 1.1,
			});
		});
	};

	useEffect(() => {
		initializeTilt();
	}, [pokemons]);

	return (
		<div>
			<div className='Search'>
				<input
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					onKeyUp={handleKeyPress}
					placeholder='Search'
					autoFocus
				/>
				<button onClick={handleSearch}>
					<FaSearch />
				</button>
			</div>
			{error && <p>{error}</p>}
			<ul>
				{pokemons.map(pokemonName => (
					<PokemonItem
						key={pokemonName}
						pokemonName={pokemonName}
						onDelete={handleDelete}
					/>
				))}
			</ul>
		</div>
	);
};

export default PokemonList;
