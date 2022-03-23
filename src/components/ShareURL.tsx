import { t } from 'ttag'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch } from 'react-redux'
import ModalCard from './ModalCard'
import config from '../config'
import { dumpConfiguration } from '../actions/saves'
import { post } from '../io'
import { setError } from '../actions/error'

type ShareURLProps = {
  configuration: any
  version: number
}

const ShareURL = ({ configuration, version }: ShareURLProps) => {
  const dispatch = useDispatch()
  const [url, setUrl] = useState('')
  const [fetchingUrl, setFetchingUrl] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  const resetState = () => {
    setUrl('')
    setFetchingUrl(false)
    setUrlCopied(false)
  }

  const onFetchURL = () => {
    resetState()
    setFetchingUrl(true)
    const shareUrl = `${config.apiRoot}share-urls/`
    const data = {
      configuration: JSON.stringify(dumpConfiguration(configuration)),
      version,
    }
    post(shareUrl, data)
      .then(response => {
        const { status, statusText } = response
        if (status >= 200 && status < 300) {
          response.json().then(hash => {
            const { location } = window
            const { protocol, host, pathname } = location
            setUrl(`${protocol}//${host + pathname}?s=${hash}`)
          })
        } else {
          const dispatchError = (body: any) => {
            const errorMessage = (
              <>
                <div>
                  <strong>What was happening:</strong> Creating share url
                </div>
                <div>
                  <strong>Status:</strong> {status}
                </div>
                <div>
                  <strong>Status text:</strong> {statusText}
                </div>
                <div>
                  <div>
                    <strong>Response body:</strong>
                  </div>
                  <div>{body}</div>
                </div>
              </>
            )
            dispatch(setError('Error', 'There was a problem creating your url', errorMessage))
          }
          response
            .text()
            .then(body => {
              dispatchError(body)
            })
            .catch(() => {
              dispatchError(null)
            })
        }
      })
      .finally(() => {
        setFetchingUrl(false)
      })
  }

  return (
    <>
      <ModalCard
        onHide={() => !fetchingUrl && resetState()}
        title="Share URL"
        active={fetchingUrl || !!url}
        footer={(
          <div style={{ textAlign: 'right', width: '100%' }}>
            {urlCopied && <p style={{ color: 'red', display: 'inline-block', padding: '8px' }}>{t`Copied`}</p>}
            {url && (
              <CopyToClipboard text={url} onCopy={() => setUrlCopied(true)}>
                <button type="button" className="button" disabled={urlCopied}>
                  {t`Copy to clipboard`}
                </button>
              </CopyToClipboard>
            )}
            <button
              type="button"
              onClick={resetState}
              className="button is-primary is-pulled-right"
              disabled={fetchingUrl}
            >
              {t`Done`}
            </button>
          </div>
        )}
      >
        {url ? <a href={url}>{url}</a> : t`Loading Url...`}
      </ModalCard>
      <button type="button" onClick={onFetchURL} className="button is-dark">
        <span className="icon-share-12" aria-hidden="true" /> &nbsp;{t`Get URL`}
      </button>
    </>
  )
}

export default ShareURL
