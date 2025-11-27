import {RenderResult, render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {DataTable, Column} from './dataTable'

interface TestData {
  id: string
  name: string
  age: number
  email: string
}

describe('DataTable', () => {
  const mockData: TestData[] = [
    {id: '1', name: 'João Silva', age: 25, email: 'joao@email.com'},
    {id: '2', name: 'Maria Santos', age: 30, email: 'maria@email.com'},
    {id: '3', name: 'Pedro Costa', age: 28, email: 'pedro@email.com'},
  ]

  const mockColumns: Column<TestData>[] = [
    {id: 'name', header: 'Nome', align: 'left'},
    {id: 'age', header: 'Idade', align: 'center'},
    {id: 'email', header: 'Email', align: 'left'},
  ]

  let component: RenderResult

  describe('Renderização', () => {
    describe('QUANDO há dados para exibir', () => {
      beforeEach(() => {
        component = render(<DataTable columns={mockColumns} rows={mockData} />)
      })

      test('DEVE renderizar o cabeçalho da tabela', () => {
        expect(component.getByText('Nome')).toBeInTheDocument()
        expect(component.getByText('Idade')).toBeInTheDocument()
        expect(component.getByText('Email')).toBeInTheDocument()
      })

      test('DEVE renderizar todas as linhas de dados', () => {
        expect(component.getByText('João Silva')).toBeInTheDocument()
        expect(component.getByText('Maria Santos')).toBeInTheDocument()
        expect(component.getByText('Pedro Costa')).toBeInTheDocument()
        expect(component.getByText('25')).toBeInTheDocument()
        expect(component.getByText('30')).toBeInTheDocument()
        expect(component.getByText('28')).toBeInTheDocument()
        expect(component.getByText('joao@email.com')).toBeInTheDocument()
        expect(component.getByText('maria@email.com')).toBeInTheDocument()
        expect(component.getByText('pedro@email.com')).toBeInTheDocument()
      })

      test('DEVE renderizar o container Paper', () => {
        expect(
          component.container.querySelector('.MuiPaper-root'),
        ).toBeInTheDocument()
      })

      test('DEVE renderizar a tabela', () => {
        expect(component.container.querySelector('table')).toBeInTheDocument()
      })
    })

    describe('QUANDO não há dados', () => {
      beforeEach(() => {
        component = render(<DataTable columns={mockColumns} rows={[]} />)
      })

      test('DEVE não renderizar o cabeçalho quando não há dados', () => {
        expect(component.queryByText('Nome')).not.toBeInTheDocument()
        expect(component.queryByText('Idade')).not.toBeInTheDocument()
        expect(component.queryByText('Email')).not.toBeInTheDocument()
      })

      test('DEVE renderizar o conteúdo vazio personalizado quando fornecido', () => {
        const emptyContent = (
          <div data-testid="empty-content">Nenhum item encontrado</div>
        )
        component.rerender(
          <DataTable
            columns={mockColumns}
            rows={[]}
            emptyContent={emptyContent}
          />,
        )
        expect(component.getByTestId('empty-content')).toBeInTheDocument()
      })
    })

    describe('QUANDO está carregando', () => {
      beforeEach(() => {
        component = render(
          <DataTable columns={mockColumns} rows={mockData} loading={true} />,
        )
      })

      test('DEVE renderizar o conteúdo de loading personalizado quando fornecido', () => {
        const loadingContent = (
          <div data-testid="loading-content">Carregando...</div>
        )
        component.rerender(
          <DataTable
            columns={mockColumns}
            rows={mockData}
            loading={true}
            loadingContent={loadingContent}
          />,
        )
        expect(component.getByTestId('loading-content')).toBeInTheDocument()
      })

      test('DEVE não renderizar os dados quando está carregando', () => {
        expect(component.queryByText('João Silva')).not.toBeInTheDocument()
      })
    })

    describe('QUANDO há erro', () => {
      beforeEach(() => {
        component = render(
          <DataTable columns={mockColumns} rows={mockData} error={true} />,
        )
      })

      test('DEVE renderizar o conteúdo de erro personalizado quando fornecido', () => {
        const errorContent = (
          <div data-testid="error-content">Erro ao carregar dados</div>
        )
        component.rerender(
          <DataTable
            columns={mockColumns}
            rows={mockData}
            error={true}
            errorContent={errorContent}
          />,
        )
        expect(component.getByTestId('error-content')).toBeInTheDocument()
      })

      test('DEVE não renderizar os dados quando há erro', () => {
        expect(component.queryByText('João Silva')).not.toBeInTheDocument()
      })
    })

    describe('QUANDO há renderização customizada', () => {
      const customColumns: Column<TestData>[] = [
        {id: 'name', header: 'Nome'},
        {
          id: 'age',
          header: 'Idade',
          render: row => (
            <span data-testid={`age-${row.id}`}>{row.age} anos</span>
          ),
        },
        {id: 'email', header: 'Email'},
      ]

      beforeEach(() => {
        component = render(
          <DataTable columns={customColumns} rows={mockData} />,
        )
      })

      test('DEVE usar a função render customizada', () => {
        expect(component.getByTestId('age-1')).toHaveTextContent('25 anos')
        expect(component.getByTestId('age-2')).toHaveTextContent('30 anos')
        expect(component.getByTestId('age-3')).toHaveTextContent('28 anos')
      })
    })
  })

  describe('Alinhamento das colunas', () => {
    const columnsWithAlignment: Column<TestData>[] = [
      {id: 'name', header: 'Nome', align: 'left'},
      {id: 'age', header: 'Idade', align: 'center'},
      {id: 'email', header: 'Email', align: 'right'},
    ]

    beforeEach(() => {
      component = render(
        <DataTable columns={columnsWithAlignment} rows={mockData} />,
      )
    })

    test('DEVE aplicar o alinhamento correto nas células do cabeçalho', () => {
      const headerCells = component.container.querySelectorAll('thead th')
      expect(headerCells[0]).toHaveStyle('text-align: left')
      expect(headerCells[1]).toHaveStyle('text-align: center')
      expect(headerCells[2]).toHaveStyle('text-align: right')
    })

    test('DEVE aplicar o alinhamento correto nas células do corpo', () => {
      const bodyCells = component.container.querySelectorAll(
        'tbody tr:first-child td',
      )
      expect(bodyCells[0]).toHaveStyle('text-align: left')
      expect(bodyCells[1]).toHaveStyle('text-align: center')
      expect(bodyCells[2]).toHaveStyle('text-align: right')
    })
  })

  describe('Largura das colunas', () => {
    const columnsWithWidth: Column<TestData>[] = [
      {id: 'name', header: 'Nome', width: '200px'},
      {id: 'age', header: 'Idade', width: '100px'},
      {id: 'email', header: 'Email', width: '300px'},
    ]

    beforeEach(() => {
      component = render(
        <DataTable columns={columnsWithWidth} rows={mockData} />,
      )
    })

    test('DEVE aplicar a largura personalizada nas células do cabeçalho', () => {
      const headerCells = component.container.querySelectorAll('thead th')
      expect(headerCells[0]).toHaveStyle('width: 200px')
      expect(headerCells[1]).toHaveStyle('width: 100px')
      expect(headerCells[2]).toHaveStyle('width: 300px')
    })
  })
})
