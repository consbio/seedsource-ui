import React from 'react'
import { t } from 'ttag'
import ConfigurationStep from '../containers/ConfigurationStep'
import Traits from '../containers/Traits'

const TraitStep = ({ number }: { number: number }) => (
  <ConfigurationStep title={t`Select traits`} number={number} name="traits" active>
    <Traits />
  </ConfigurationStep>
)

TraitStep.shouldRender = ({ runConfiguration }: { runConfiguration: any }) => runConfiguration.method === 'function'

export default TraitStep
