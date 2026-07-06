import Form from 'react-bootstrap/Form'
import { Icon } from '../icons/Icon'

export interface SearchFieldProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function SearchField({ id, label, placeholder, value, onChange, disabled }: SearchFieldProps) {
  return (
    <Form.Group controlId={id} className="position-relative">
      <Form.Label className="visually-hidden">{label}</Form.Label>
      <Form.Control
        type="search"
        placeholder={placeholder ?? label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ paddingLeft: 36 }}
      />
      <span
        className="position-absolute top-50 translate-middle-y"
        style={{ left: 10, color: 'var(--sg-text-muted)', pointerEvents: 'none' }}
      >
        <Icon name="buscar" size={16} />
      </span>
    </Form.Group>
  )
}
