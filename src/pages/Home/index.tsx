import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ButtonContainer, CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, SeparatorContainer, TaskInput } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { Play } from 'phosphor-react'
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
}

export const Home = () => {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const handleSubmitForm = (event: any) => {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: event.task,
      minutesAmount: event.minutesAmount
    }

    setCycles(old => [...old, newCycle])
    setActiveCycleId(id)
    //sempre que a alteração de estado depender do valor anterior é usado o formato de arrowfunction
    //para adicionar uma informação no array, eu preciso copiar todas as informções anteriores e somar com as novas
    //toda vez que estou alterando um estado e esse estado depende de um versão anterior é interessante o valor do estado ser setado no formato de função
    reset()
  }

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
  console.log(activeCycle)

  const task = watch('task')
  const isSubmitDisabled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleSubmitForm)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput type="task" list="task-suggestions" placeholder="Dê um nome para o seu projeto" {...register('task')} />
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
          />

          <span> minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <SeparatorContainer>:</SeparatorContainer>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <ButtonContainer disabled={isSubmitDisabled} type="submit">
          <Play size={24} /> Começar
        </ButtonContainer>
      </form>
    </HomeContainer>
  )
}
