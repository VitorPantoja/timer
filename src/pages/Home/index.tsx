import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  SeparatorContainer,
  StartCountDownButton,
  TaskInput,
  StoptCountDownButton,
  CountdownContainer
} from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import { HandPalm, Play } from 'phosphor-react'
import * as zod from 'zod'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod.number().min(5, 'O ciclo precisa ser de no mínimo 5 minutos.').max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
}

export const Home = () => {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
  useEffect(() => {
    let interval: NodeJS.Timer

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  const handleSubmitForm = (event: NewCycleFormData) => {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: event.task,
      minutesAmount: event.minutesAmount,
      startDate: new Date()
    }

    setCycles(old => [...old, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    //sempre que a alteração de estado depender do valor anterior é usado o formato de arrowfunction
    //para adicionar uma informação no array, eu preciso copiar todas as informções anteriores e somar com as novas
    //toda vez que estou alterando um estado e esse estado depende de um versão anterior é interessante o valor do estado ser setado no formato de função
    reset()
  }

  const handleInterruptCycle = () => {
    setCycles(
      cycles.map(cycle => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}: ${seconds}`
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleSubmitForm)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput type="task" list="task-suggestions" placeholder="Dê um nome para o seu projeto" {...register('task')} disabled={!!activeCycle} />
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
          </datalist>
          <label htmlFor="minutesAmount">durante </label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
            disabled={!!activeCycle}
          />

          <span> minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <SeparatorContainer>:</SeparatorContainer>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
        {activeCycle ? (
          <StoptCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} /> Intrerromper
          </StoptCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
