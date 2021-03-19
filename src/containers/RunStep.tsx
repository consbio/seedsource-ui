import React, { RefObject } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import parse from 'csv-parse'
import ConfigurationStep from './ConfigurationStep'
import SaveModal from './SaveModal'
import ModalCard from '../components/ModalCard'
import Dropdown from '../components/Dropdown'
import Map from './Map'
import { setError } from '../actions/error'
import { runJob } from '../actions/job'
import { showSaveModal } from '../actions/saves'
import { createReport, runTIFJob } from '../actions/report'
import { reports } from '../config'
import { clearUploadedPoints, setUploadedPoints } from '../actions/point'

const configurationCanRun = ({ point, variables, traits }: { point: any; variables: any[]; traits: any[] }) => {
  if (point === null || point.x === null || point.y === null) {
    return false
  }

  const variablesComplete =
    variables.length > 0 && variables.every(item => item.value !== null && item.isFetching === false)
  const traitsComplete = traits.length > 0 && traits.every(item => item.value !== null)

  return variablesComplete || traitsComplete
}

const connector = connect(
  ({
    runConfiguration,
    lastRun,
    job,
    auth,
    reportIsFetching,
  }: {
    runConfiguration: any
    lastRun: any
    job: any
    auth: { isLoggedIn: boolean }
    reportIsFetching: boolean
  }) => {
    const { isLoggedIn } = auth

    return {
      canRun: configurationCanRun(runConfiguration) && !job.isRunning,
      canSave: lastRun !== null,
      configuration: runConfiguration,
      job,
      isLoggedIn,
      reportIsFetching,
    }
  },
  (dispatch: (event: any) => any) => ({
    onUploadCsv: (headers: { x: string; y: string }, columnOrder: string[], points: { [key: string]: any }[]) =>
      dispatch(setUploadedPoints(headers, columnOrder, points)),

    onClearCsv: () => dispatch(clearUploadedPoints()),

    onRun: (configuration: any) => {
      const { variables, constraints } = configuration

      if (variables.some((item: any) => item.transfer === null)) {
        dispatch(
          setError(
            'Configuration error',
            'Cannot calculate scores: one or more of your variables has no transfer limit, or a limit of 0.',
          ),
        )
        return
      }

      if (constraints.some((item: any) => Object.keys(item.values).some(key => item.values[key] === null))) {
        dispatch(
          setError(
            'Configuration error',
            'Cannot calculate scores: one or more of your constraints is missing a value.',
          ),
        )
        return
      }

      dispatch(runJob(configuration))
    },

    onSave: (isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        dispatch(setError('Login required', 'Please login to save your run.'))
        return
      }

      dispatch(showSaveModal())
    },

    onExport: (name: string) => {
      dispatch(createReport(name))
    },

    onExportTIF: () => {
      dispatch(runTIFJob())
    },
  }),
)

type RunStepProps = ConnectedProps<typeof connector> & {
  number: number
}

type RunStepState = {
  previewModal: boolean
  exportType: string | null
  processingCsv: boolean
  csvError: string | null
}

class RunStep extends React.Component<RunStepProps, RunStepState> {
  static shouldRender = () => true

  fileInputRef?: RefObject<HTMLInputElement>

  constructor(props: RunStepProps) {
    super(props)

    this.fileInputRef = React.createRef()

    this.state = {
      previewModal: false,
      exportType: null,
      processingCsv: false,
      csvError: null,
    }
  }

  processCSV = (rows: [{ [key: string]: string }]) => {
    if (!rows.length) {
      this.setState({ csvError: 'The file is empty.' })
      return
    }

    const columns = Object.keys(rows[0])
    const xCol = ['x', 'lon', 'long', 'longitude'].find(name => columns.includes(name))
    const yCol = ['y', 'lat', 'latitude'].find(name => columns.includes(name))

    if (!(xCol && yCol)) {
      this.setState({ csvError: 'The CSV has no latitude and/or longitude column.' })
      return
    }

    const points = rows.map(row => ({ ...row, [xCol]: parseFloat(row[xCol]), [yCol]: parseFloat(row[yCol]) }))
    const { onUploadCsv } = this.props
    onUploadCsv({ x: xCol, y: yCol }, columns, points)
  }

  render() {
    const {
      number,
      configuration,
      canRun,
      canSave,
      isLoggedIn,
      reportIsFetching,
      onClearCsv,
      onRun,
      onSave,
      onExport,
      onExportTIF,
    } = this.props
    const { uploadedPoints } = configuration
    const { previewModal, processingCsv, csvError } = this.state

    return (
      <ConfigurationStep
        title="Map your Results"
        number={number}
        name="run"
        active={false}
        extraOptions={[
          { label: 'Upload locations to evaluate...', callback: () => this.fileInputRef?.current?.click() },
          ...(uploadedPoints ? [{ label: 'Clear uploaded locations', callback: () => onClearCsv() }] : []),
        ]}
      >
        <input
          type="file"
          className="is-hidden"
          aria-hidden="true"
          ref={this.fileInputRef}
          onChange={({ target: { files } }) => {
            if (files?.length) {
              this.setState({ processingCsv: true })

              const file = files[0]
              const reader = new FileReader()

              reader.onload = e => {
                if (e.target?.result) {
                  parse(e.target.result as string, { columns: true }, (err, result) => {
                    if (err) {
                      this.setState({ csvError: err.message })
                    } else {
                      this.processCSV(result)
                      this.setState({ processingCsv: false })
                    }
                  })
                }
              }

              reader.readAsText(file)
            }
          }}
        />

        {(processingCsv || csvError) && (
          <>
            <ModalCard
              title="Uploading CSV"
              active
              footer={
                csvError && (
                  <div style={{ textAlign: 'right', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => {
                        this.setState({ csvError: null })
                      }}
                      className="button is-primary is-pulled-right"
                    >
                      Done
                    </button>
                  </div>
                )
              }
            >
              {csvError ? (
                <div>{csvError}</div>
              ) : (
                <>
                  <div>Uploading CSV data...</div>
                  <progress />
                </>
              )}
            </ModalCard>
          </>
        )}

        <div>
          <button
            type="button"
            className="button is-primary is-large is-fullwidth"
            disabled={!canRun}
            onClick={() => {
              onRun(configuration)
            }}
          >
            Run Tool
          </button>
        </div>
        <div className="margin-top-10">
          <div>
            <button
              type="button"
              className="button is-pulled-left"
              disabled={!canSave}
              onClick={e => {
                e.preventDefault()
                onSave(isLoggedIn)
              }}
            >
              <span className="icon12 icon-save" aria-hidden="true" /> Save Last Run
            </button>
            <Dropdown
              className="is-pulled-right is-right is-hidden-mobile"
              up
              title="Export As..."
              disabled={!canSave || reportIsFetching}
            >
              {reports.map(r => (
                <a
                  key={r.name}
                  className="dropdown-item"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({
                      previewModal: true,
                      exportType: r.name,
                    })
                  }}
                >
                  {r.label}
                </a>
              ))}
              <a
                className="dropdown-item"
                onClick={e => {
                  e.preventDefault()
                  onExportTIF()
                }}
              >
                GeoTIFF
              </a>
            </Dropdown>
            {previewModal ? (
              <ModalCard
                className="report-preview"
                active
                onHide={() => {
                  this.setState({ previewModal: false })
                }}
                title="Position the map for export:"
                footer={(
                  <button
                    type="button"
                    onClick={() => {
                      const { exportType } = this.state

                      this.setState({ previewModal: false })
                      onExport(exportType!)
                    }}
                    className="button is-primary is-large"
                  >
                    Export
                  </button>
                )}
              >
                <div className="map preview-map">
                  <Map simple />
                </div>
              </ModalCard>
            ) : null}
          </div>
          <div className="is-clearfix" />
        </div>
        <SaveModal />
      </ConfigurationStep>
    )
  }
}

export default connector(RunStep)
