import React from 'react'
import ConfigurationStep from '../containers/ConfigurationStep'
import Traits from '../containers/Traits'

const TraitStep = ({ number }: { number: number }) => (
  <ConfigurationStep title="Select traits" number={number} name="traits" active>
    <Traits />
  </ConfigurationStep>
)

TraitStep.shouldRender = ({ runConfiguration }: { runConfiguration: any }) => runConfiguration.method === 'function'

export default TraitStep
