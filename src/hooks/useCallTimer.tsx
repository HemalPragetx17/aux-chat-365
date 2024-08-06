import { useContext } from 'react'

import { CallTimerContext } from '../context/CallTimerContext'

export const useCallTimer = () => useContext(CallTimerContext)
