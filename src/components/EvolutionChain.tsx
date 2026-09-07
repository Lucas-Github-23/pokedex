import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { EvolutionStage } from '../types/pokemon';

interface EvolutionChainProps {
  stages: EvolutionStage[];
  currentId: number;
  onSelectPokemon: (id: number) => void;
}

function formatEvolutionCondition(stage: EvolutionStage): string {
  if (stage.minLevel) {
    return `Nível ${stage.minLevel}`;
  }
  if (stage.item) {
    const cleanItem = stage.item
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return cleanItem;
  }
  if (stage.triggerName === 'trade') {
    return 'Troca';
  }
  if (stage.triggerName === 'use-item') {
    return 'Usar Item';
  }
  if (stage.triggerName === 'shed') {
    return 'Espaço Vazio';
  }
  if (stage.triggerName) {
    return stage.triggerName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return 'Evolução';
}

function getStageLabel(index: number, total: number): string {
  if (index === 0) return 'Forma Inicial';
  if (index === 1 && total === 2) return 'Evolução Final';
  if (index === 1) return 'Estágio 1';
  if (index === 2) return 'Estágio Final';
  return `Estágio ${index}`;
}

export const EvolutionChain: React.FC<EvolutionChainProps> = ({
  stages,
  currentId,
  onSelectPokemon,
}) => {
  if (!stages || stages.length === 0) {
    return (
      <div className="evo-empty-card">
        <span className="evo-empty-title">DADOS NÃO REGISTRADOS</span>
        <p>Sem informações de evolução para este espécime na base de dados.</p>
      </div>
    );
  }

  if (stages.length === 1) {
    return (
      <div className="evo-empty-card">
        <span className="evo-empty-title">FORMA ÚNICA // SEM EVOLUÇÃO</span>
        <p>Este Pokémon não possui estágios evolutivos conhecidos.</p>
      </div>
    );
  }

  return (
    <div className="evo-system-wrapper">
      <div className="evo-system-header">
        <span className="evo-system-title">MATRIZ EVOLUTIVA DO ESPÉCIME</span>
        <span className="evo-system-count">{stages.length} ESTÁGIOS CADASTRADOS</span>
      </div>

      <div className="evo-linear-pipeline">
        {stages.map((stage, index) => {
          const isCurrent = stage.id === currentId;
          const formattedId = `№ ${String(stage.id).padStart(4, '0')}`;
          const stageLabel = getStageLabel(index, stages.length);
          const nextStageCondition =
            index < stages.length - 1 ? formatEvolutionCondition(stages[index + 1]) : null;

          return (
            <React.Fragment key={`${stage.id}-${index}`}>
              {/* Compact Specimen Evolution Card */}
              <div
                className={`evo-specimen-node ${isCurrent ? 'is-active' : ''}`}
                onClick={() => onSelectPokemon(stage.id)}
                role="button"
                tabIndex={0}
                title={`Clique para inspecionar ${stage.name}`}
              >
                <div className="evo-node-header">
                  <span className="evo-node-stage-tag">{stageLabel}</span>
                  {isCurrent && (
                    <span className="evo-node-current-tag" title="Espécime Atual">
                      <CheckCircle2 size={10} /> ATUAL
                    </span>
                  )}
                </div>

                <div className="evo-node-sprite-box">
                  <img
                    src={stage.sprite}
                    alt={stage.name}
                    className="evo-node-sprite-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`;
                    }}
                  />
                </div>

                <div className="evo-node-footer">
                  <span className="evo-node-name">{stage.name}</span>
                  <span className="evo-node-id">{formattedId}</span>
                </div>
              </div>

              {/* Connector with Condition */}
              {index < stages.length - 1 && (
                <div className="evo-connector-bridge">
                  <div className="evo-bridge-line" />
                  <div className="evo-bridge-badge">
                    <ArrowRight size={12} className="evo-bridge-icon" />
                    <span>{nextStageCondition}</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
