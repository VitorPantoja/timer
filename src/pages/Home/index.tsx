import { ButtonContainer, CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, SeparatorContainer, TaskInput } from './styles'
import { Play } from 'phosphor-react'
export const Home = () => {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput type="task" list="task-suggestions" placeholder="Dê um nome para o seu projeto" />
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
          </datalist>
          <label htmlFor="minutesAmount">durante </label>
          <MinutesAmountInput type="number" id="minutesAmount" placeholder="00" step={5} min={5} max={60} />

          <span> minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <SeparatorContainer>:</SeparatorContainer>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <ButtonContainer type="submit">
          <Play size={24} /> Comerçar
        </ButtonContainer>
      </form>
    </HomeContainer>
  )
}
