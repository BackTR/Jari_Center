import { stageLabel, STAGE_TONE } from '../../utils/stage.js'
import './StageBadge.css'

export default function StageBadge({ stage }) {
  const tone = STAGE_TONE[stage] || 'info'
  return <span className={`stage-badge stage-badge--${tone}`}>{stageLabel(stage)}</span>
}
