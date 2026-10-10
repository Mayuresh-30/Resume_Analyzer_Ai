import type { Suggestion as SuggestionItem } from '../types'

type SuggestionsProps = {
  title: string
  items: SuggestionItem[]
}

export default function Suggestions({ title, items }: SuggestionsProps) {
  return (
    <section className="suggestion-section">
      <h3>{title}</h3>
      {items.length ? (
        <ul>{items.map((item, index) => (
          <li key={`${item.category}-${index}`}>
            <strong>{item.category}</strong>
            <p>{item.issue}</p>
            <p className="suggestion-fix">{item.fix}</p>
          </li>
        ))}</ul>
      ) : (
        <p className="empty-note">No items to show.</p>
      )}
    </section>
  )
}