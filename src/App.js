import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.less';
import { map, get } from 'lodash';
import moment from 'moment';
import { Select, InputNumber, Button, Typography, Affix } from 'antd';

const { Option } = Select;
const { Title } = Typography;
const BASE_URL = 'http://localhost:7070/v1';

function App() {
  const [eventos, setEventos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [mentores, setMentores] = useState([]);
  const [minimo, setMinimo] = useState(0);
  const [data, setData] = useState({
    alunoId: null,
    eventoId: null,
    eventoData: null,
    mentorId: null,
    aposta: null,
  });

  const isValid = (data) => {
    if (!data?.aposta) return false;
    if (!data?.eventoId) return false;
    if (!data?.eventoData) return false;
    if (!data?.alunoId) return false;
    if (!data?.mentorId) return false;
    return true;
  }

  const getMentoresBasedByEvento = (eventoId) => {
    const { mentores, data: eventoData } = eventos.find(evento => evento._id.toString() === eventoId.toString())
    setData({ ...data, eventoId, eventoData });
    setMentores(mentores);
  }

  const enviarAposta = async () => {
      console.log(data);
    const { aposta, alunoId } = data;
    const { moeda } = alunos.find(aluno => aluno._id.toString() === alunoId.toString());

    if (moeda < aposta) {
      alert(`Não é possível fazer essa aposta, pois é necessário ter no mínimo ${aposta} moeda(s) e você somente tem ${moeda} moeda(s)   disponíveis!`);
      return;
    }
    const response = await fetch(`${BASE_URL}/aposta`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
    });
    const { saldo } = await response.json();
    
    const novosAlunos = [...alunos];
    for (let novoAluno of novosAlunos) {
      if (novoAluno._id.toString() === alunoId.toString()) {
        novoAluno.moeda = saldo;
      }
    }
    setAlunos(novosAlunos);

    alert(`Sua aposta foi enviada com sucesso!`);
    setData({ ...data, aposta: null });
  }

  useEffect(() => {
    const fetchAlunos = async () => {
      const response = await fetch(`${BASE_URL}/alunos`);
      const alunos = await response.json();
      setAlunos(alunos);
    }

    const fetchEventos = async () => {
      const response = await fetch(`${BASE_URL}/eventos`);
      const eventos = await response.json();
      setEventos(eventos);
    }
    fetchAlunos();
    fetchEventos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Title level={1}>Bet Pearl</Title>
      </header>

      <div className="field">
        <Select
          size="large"
          showSearch
          style={{ width: '90%' }}
          placeholder="Escolha um aluno"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(alunoId) => setData({ ...data, alunoId })}
        >
          {map(alunos, data => (
            <Option
              id={get(data, '_id')}
              key={get(data, '_id')}
              value={get(data, '_id')}
            >
              {get(data, 'nome')} ({get(data, 'moeda')} moedas disponíveis)
            </Option>
          ))}
        </Select>
      </div>

      <div className="field">
        <Select
          size="large"
          showSearch
          style={{ width: '90%' }}
          placeholder="Escolha uma data de mentoria"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={getMentoresBasedByEvento}
        >
          {map(eventos, data => (
            <Option
              id={get(data, '_id')}
              key={get(data, '_id')}
              value={get(data, '_id')}
            >
              {moment(get(data, 'data')).format('DD/MM/YYYY')}
            </Option>
          ))}
        </Select>
      </div>

      <div className="field">
        <Select
          size="large"
          showSearch
          style={{ width: '90%' }}
          placeholder="Escolha o mentor desejado"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(mentorId) => {
            setData({ ...data, mentorId });
            const { valor = 0 } = mentores.find(mentor => mentor._id.toString() === mentorId.toString());
            setMinimo(valor);
          }}
        >
          {map(mentores, data => (
            <Option
              id={get(data, '_id')}
              key={get(data, '_id')}
              value={get(data, '_id')}
            >
              {get(data, 'nome')} ({get(data, 'valor')} moedas são necessárias)
            </Option>
          ))}
        </Select>
      </div>

      <div className="field">
        <InputNumber
          size="large"
          style={{ width: '90%' }}
          precision={0}
          min={minimo}
          max={99}
          step={1}
          value={data?.aposta}
          placeholder="Coloque a quantidade de pearls"
          onChange={(aposta) => setData({ ...data, aposta })}
        />
        <span>Informe um número de 1 a 99</span>
      </div>

      <div className="field">
        <Affix offsetBottom={10} style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center' }}>
          <Button
            disabled={!isValid(data)}
            onClick={enviarAposta}
            style={{ width: '90%' }}
            type="primary"
            size="large"
          >
            Enviar Aposta
          </Button>
        </Affix>
      </div>
    </div>
  );
}

export default App;
