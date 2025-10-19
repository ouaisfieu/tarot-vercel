import React, { useState, useEffect } from 'react';
import { Share2, Shuffle, X, ArrowLeft, User, Users, Book, Eye } from 'lucide-react';

export default function TarotApp() {
  const [view, setView] = useState('home');
  const [deckType, setDeckType] = useState('marseille');
  const [drawMode, setDrawMode] = useState('solo');
  const [numCards, setNumCards] = useState(1);
  const [drawnCards, setDrawnCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger toutes les cartes du jeu sélectionné
  useEffect(() => {
    loadDeck();
  }, [deckType]);

  const loadDeck = async () => {
    setLoading(true);
    try {
      const indexPath = deckType === 'marseille' 
        ? '/index/index_tarot_marseille.json'
        : '/index/index_tarot_boulot.json';
      
      const indexRes = await fetch(indexPath);
      const index = await indexRes.json();
      
      const folder = deckType === 'marseille' ? 'marseille' : 'boulot';
      const cardsPromises = index.map(item => 
        fetch(`/${folder}/${item.file}`).then(r => r.json())
      );
      
      const cards = await Promise.all(cardsPromises);
      setAllCards(cards);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
  };

  const drawCards = () => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, numCards);
    setDrawnCards(drawn);
    setView('results');
  };

  const shareResults = () => {
    const cardsText = drawnCards.map(c => c.nom).join(', ');
    const text = `J'ai tiré : ${cardsText} avec le Tarot ${deckType === 'marseille' ? 'de Marseille' : 'de Boulot'} !`;
    
    if (navigator.share) {
      navigator.share({ title: 'Mon tirage de Tarot', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Texte copié !');
    }
  };

  const CardDetail = ({ card, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto my-8 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-6xl font-bold text-yellow-300 mb-2">{card.numero}</div>
              <h2 className="text-3xl font-bold text-white">{card.nom}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="space-y-6 text-white">
            {card.element && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Élément</h3>
                <p className="text-lg">{card.element}</p>
              </div>
            )}

            {card.mot_cle_principal && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Mot-clé principal</h3>
                <p className="text-2xl font-semibold text-yellow-300">{card.mot_cle_principal}</p>
              </div>
            )}

            {card.mots_cles_associes && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Mots-clés</h3>
                <p className="text-lg leading-relaxed">{card.mots_cles_associes}</p>
              </div>
            )}

            {card.symbolique_visuelle && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Symbolique visuelle</h3>
                <p className="text-lg leading-relaxed italic">{card.symbolique_visuelle}</p>
              </div>
            )}

            {card.interpretation_positive && (
              <div className="bg-green-900/30 rounded-lg p-4">
                <h3 className="text-sm uppercase tracking-wider text-green-300 mb-2">✨ Interprétation positive</h3>
                <p className="leading-relaxed">{card.interpretation_positive}</p>
              </div>
            )}

            {card.interpretation_negative && (
              <div className="bg-red-900/30 rounded-lg p-4">
                <h3 className="text-sm uppercase tracking-wider text-red-300 mb-2">⚠️ Interprétation négative</h3>
                <p className="leading-relaxed">{card.interpretation_negative}</p>
              </div>
            )}

            {card.interactions_notables && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Interactions notables</h3>
                <p className="leading-relaxed">{card.interactions_notables}</p>
              </div>
            )}

            {card.categorie_symbolique && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-2">Catégorie</h3>
                <p>{card.categorie_symbolique}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // HOME
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="max-w-4xl mx-auto pt-12">
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
            Tarot Divinatoire
          </h1>
          <p className="text-center text-purple-200 mb-12">Marseille & Boulot - 78 cartes complètes</p>

          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setView('browse')}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <Book className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold mb-2">Explorer</h3>
              <p className="text-sm text-purple-200">Toutes les cartes détaillées</p>
            </button>

            <button
              onClick={() => {
                setDrawMode('solo');
                setView('draw-setup');
              }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <User className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-semibold mb-2">Tirage Solo</h3>
              <p className="text-sm text-purple-200">Tirez vos cartes</p>
            </button>

            <button
              onClick={() => {
                setDrawMode('group');
                setView('draw-setup');
              }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-pink-300" />
              <h3 className="text-xl font-semibold mb-2">Tirage Groupe</h3>
              <p className="text-sm text-purple-200">À plusieurs</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // BROWSE
  if (view === 'browse') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setDeckType('marseille')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  deckType === 'marseille' ? 'bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Marseille
              </button>
              <button
                onClick={() => setDeckType('boulot')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  deckType === 'boulot' ? 'bg-blue-500 text-black' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Boulot
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center">
            {deckType === 'marseille' ? 'Tarot de Marseille' : 'Tarot de Boulot'}
          </h2>
          <p className="text-center text-purple-300 mb-8">{allCards.length} cartes</p>

          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-center hover:scale-105 transition-transform shadow-lg group"
                >
                  <div className="text-4xl font-bold mb-2">{card.numero}</div>
                  <div className="text-sm mb-2">{card.nom}</div>
                  <div className="text-xs text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 mx-auto" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </div>
    );
  }

  // DRAW SETUP
  if (view === 'draw-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <h2 className="text-3xl font-bold mb-8 text-center">
            Tirage {drawMode === 'group' ? 'de groupe' : 'solo'}
          </h2>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6">
            <label className="block text-lg font-semibold mb-4">Jeu</label>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setDeckType('marseille')}
                className={`p-4 rounded-lg transition-all ${
                  deckType === 'marseille' ? 'bg-yellow-500 text-black' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Marseille
              </button>
              <button
                onClick={() => setDeckType('boulot')}
                className={`p-4 rounded-lg transition-all ${
                  deckType === 'boulot' ? 'bg-blue-500 text-black' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Boulot
              </button>
            </div>

            <label className="block text-lg font-semibold mb-4">
              Nombre de cartes : {numCards}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={numCards}
              onChange={(e) => setNumCards(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={drawCards}
            disabled={loading || allCards.length === 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-bold py-4 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Shuffle className="w-6 h-6" />
            Tirer les cartes
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (view === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
        <div className="max-w-6xl mx-auto pt-12">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button
              onClick={shareResults}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              <Share2 className="w-5 h-5" />
              Partager
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center">Votre tirage</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {drawnCards.map((card, index) => (
              <div
                key={index}
                onClick={() => setSelectedCard(card)}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-2xl cursor-pointer hover:scale-105 transition-all"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both` }}
              >
                <div className="text-5xl font-bold text-center mb-3">{card.numero}</div>
                <div className="text-xl font-semibold text-center mb-4">{card.nom}</div>
                <div className="text-center text-yellow-300 text-lg mb-3">{card.mot_cle_principal}</div>
                <div className="text-sm text-center text-purple-200">
                  Cliquez pour voir les détails
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setView('draw-setup')}
              className="bg-white/10 px-8 py-3 rounded-lg hover:bg-white/20 transition-all"
            >
              Nouveau tirage
            </button>
          </div>
        </div>

        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
}
