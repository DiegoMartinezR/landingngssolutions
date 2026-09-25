import Tippy from "@tippyjs/react"
import React, { useEffect, useRef } from "react"

const SwitchFormGroup = ({ id, col, eRef, label, specification, required = false, onChange, disabled = false, checked, refreshable = null }) => {
  if (!id) id = `ck-${crypto.randomUUID()}`
  const internalRef = useRef()
  const elRef = eRef || internalRef

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const switchery = new Switchery(el, {
      size: 'small',
      color: '#64b0f2'
    })

    const handleChange = (e) => {
      if (onChange) onChange(e)
    }

    $(el).on('change', handleChange)

    return () => {
        $(el).off('change', handleChange)
        if (switchery.handle) {
            $(el).next('.switchery').remove()
        }
    }
  }, [refreshable])

  return <>
    <div className={`form-group ${col} mb-2`}>
      {
        label &&
        <>
          <label htmlFor={id} className="form-label mb-1 d-block">
            {label} {required && <b className="text-danger">*</b>}
            {specification && <Tippy content={specification}>
              <small className="ms-1 fa fa-question-circle text-muted"></small>
            </Tippy>
            }
          </label>
        </>
      }
      <input ref={elRef} id={id} type="checkbox" data-plugin="switchery" required={required} disabled={disabled} defaultChecked={checked} />
    </div>
  </>
}

export default SwitchFormGroup