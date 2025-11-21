import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import './Tag.scss'

export default function Tag({ tag }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const tagRef = useRef(null)

  const handleMouseEnter = () => {
    if (tagRef.current) {
      const rect = tagRef.current.getBoundingClientRect()
      setCoords({
        top: rect.top + window.scrollY - 8, // 8px gap above the element
        left: rect.left + window.scrollX + (rect.width / 2)
      })
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <>
      <span
        ref={tagRef}
        className="tag-pill"
        style={{ background: tag.bg, color: tag.color }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tag.label}
      </span>
      {showTooltip && createPortal(
        <span
          className="tag-tooltip portal"
          style={{
            top: coords.top,
            left: coords.left,
          }}
        >
          <span className="tag-tooltip-title" style={{ color: tag.bg }}>{tag.label}</span>
          {tag.description && (
            <span className="tag-tooltip-desc">{tag.description}</span>
          )}
        </span>,
        document.body
      )}
    </>
  )
}

Tag.propTypes = {
  tag: PropTypes.shape({
    label: PropTypes.string.isRequired,
    bg: PropTypes.string,
    color: PropTypes.string,
    description: PropTypes.string
  }).isRequired
}
