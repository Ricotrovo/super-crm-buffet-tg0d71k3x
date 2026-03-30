import { Contract } from '@/lib/types'

export function ContractPrintView({ contract }: { contract: Contract }) {
  return (
    <div className="space-y-4 print:block print:text-black text-sm text-justify font-sans bg-white text-black p-4 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold underline">
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE BUFFET INFANTIL
        </h2>
      </div>

      <p>
        Pelo presente instrumento particular, de um lado{' '}
        <strong>TRIBO DA FOLIA FESTAS E EVENTOS EIRELI</strong>, pessoa jurídica de direito privado,
        inscrita no CNPJ sob o nº 10.368.886/0001-84, com sede em Guarulhos/SP, doravante denominada{' '}
        <strong>CONTRATADA</strong>, e de outro lado:
      </p>

      <div className="border border-black p-3 space-y-1 bg-white">
        <div>
          <strong>CONTRATANTE:</strong> {contract.clientName}
        </div>
        <div>
          <strong>Nacionalidade:</strong> {contract.clientNationality || '________________'} |{' '}
          <strong>Estado Civil:</strong> {contract.clientMaritalStatus || '________________'}
        </div>
        <div>
          <strong>RG:</strong> {contract.clientRg || '________________'} | <strong>CPF:</strong>{' '}
          {contract.clientCpf || '________________'}
        </div>
        <div>
          <strong>Endereço:</strong> {contract.clientAddress || '________________'}
        </div>
        <div>
          <strong>E-mail:</strong> {contract.clientEmail || '________________'} |{' '}
          <strong>WhatsApp:</strong> {contract.clientPhone || '________________'}
        </div>
      </div>

      <p>
        Têm entre si, justo e contratado o presente Contrato de Prestação de Serviços, regido pelas
        cláusulas abaixo e pelo Quadro Resumo:
      </p>

      <h3 className="font-bold text-center bg-gray-200 print:bg-gray-200 py-1 border border-black uppercase print:border-black print:text-black">
        Quadro Resumo
      </h3>
      <table className="w-full border-collapse border border-black text-sm mb-4 break-inside-avoid">
        <tbody>
          <tr>
            <td className="border border-black p-1 font-bold w-1/3">Aniversariante:</td>
            <td className="border border-black p-1">
              {contract.birthdayPersonName || '________________'} (
              {contract.birthdayPersonAge || '__'} anos)
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Data do Evento:</td>
            <td className="border border-black p-1">
              {contract.eventDate
                ? new Date(contract.eventDate).toLocaleDateString('pt-BR')
                : '____/____/____'}{' '}
              -{' '}
              {contract.eventDate
                ? new Date(contract.eventDate).toLocaleDateString('pt-BR', { weekday: 'long' })
                : ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Horário:</td>
            <td className="border border-black p-1">
              {contract.eventTimeStart || '__:__'} às {contract.eventTimeEnd || '__:__'} (Duração: 4
              horas)
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Salão:</td>
            <td className="border border-black p-1">{contract.eventHall || '________________'}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Número de Convidados:</td>
            <td className="border border-black p-1">
              {contract.guestCount || '____'} (Crianças até 5 anos não pagam)
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Tema da Decoração:</td>
            <td className="border border-black p-1">
              {contract.decorationTheme || '________________'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Inclusos Especiais/Cortesias:</td>
            <td className="border border-black p-1">{contract.specialInclusions || '-'}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Bebida Alcoólica Inclusa:</td>
            <td className="border border-black p-1">
              {contract.alcoholicDrinksIncluded ? 'Sim' : 'Não'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Valor Total Acordado:</td>
            <td className="border border-black p-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                contract.total,
              )}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">Condições de Pagamento:</td>
            <td className="border border-black p-1">
              {contract.paymentMethodDescription || '________________'}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-2 mt-4 text-xs">
        <p>
          <strong>CLÁUSULA PRIMEIRA - DO OBJETO:</strong> O presente contrato tem por objeto a
          prestação de serviços de buffet infantil, compreendendo locação do espaço, alimentação,
          bebidas não alcoólicas (conforme cardápio escolhido), equipe de apoio e recreação,
          conforme especificações do Quadro Resumo.
        </p>
        <p>
          <strong>CLÁUSULA SEGUNDA - DA EXECUÇÃO DO EVENTO E CONVIDADOS EXCEDENTES:</strong> O
          evento terá a duração estipulada no Quadro Resumo. Ultrapassado o número de convidados
          contratados, será cobrada uma taxa de R$ 100,00 (cem reais) por convidado excedente
          (adulto ou criança acima de 5 anos), a ser paga ao término do evento.
        </p>
        <p>
          <strong>CLÁUSULA TERCEIRA - DA RESPONSABILIDADE CIVIL E DANOS:</strong> A CONTRATADA não
          se responsabiliza por objetos deixados ou perdidos nas dependências do buffet. O
          CONTRATANTE assume total responsabilidade por danos materiais causados à estrutura, móveis
          ou equipamentos do buffet por seus convidados, devendo ressarcir a CONTRATADA.
        </p>
        <p>
          <strong>CLÁUSULA QUARTA - DOS SERVIÇOS E ALIMENTOS DE TERCEIROS:</strong> É
          terminantemente proibida a entrada de alimentos e bebidas não fornecidos pela CONTRATADA,
          salvo exceções previamente acordadas e descritas no Quadro Resumo. A CONTRATADA isenta-se
          de qualquer responsabilidade sobre a qualidade ou efeitos de alimentos fornecidos por
          terceiros.
        </p>
        <p>
          <strong>CLÁUSULA QUINTA - DO CANCELAMENTO E RESCISÃO:</strong> Em caso de rescisão por
          parte do CONTRATANTE, haverá retenção dos valores pagos a título de multa compensatória
          nos seguintes percentuais sobre o valor total do contrato: a) 20% se cancelado com mais de
          90 dias de antecedência; b) 30% se cancelado entre 89 e 30 dias de antecedência; c) 50% se
          cancelado com menos de 30 dias de antecedência.
        </p>
        <p>
          <strong>CLÁUSULA SEXTA - CASO FORTUITO E FORÇA MAIOR:</strong> As partes não serão
          responsabilizadas pelo não cumprimento das obrigações aqui assumidas em virtude de caso
          fortuito ou força maior, sendo facultada a remarcação do evento mediante disponibilidade
          de agenda e acordo mútuo.
        </p>
        <p>
          <strong>CLÁUSULA SÉTIMA - DIREITO DE IMAGEM E LGPD:</strong> O CONTRATANTE{' '}
          {contract.imageRightsGranted ? 'AUTORIZA' : 'NÃO AUTORIZA'} a CONTRATADA a registrar
          imagens do evento para fins de portfólio e divulgação nas redes sociais oficiais da
          empresa, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>
        <p>
          <strong>CLÁUSULA OITAVA - DO FORO:</strong> Para dirimir quaisquer controvérsias oriundas
          deste contrato, as partes elegem o foro da Comarca de Guarulhos/SP, renunciando a qualquer
          outro por mais privilegiado que seja.
        </p>
      </div>

      <div className="mt-8 text-center text-sm break-inside-avoid">
        <p className="mb-8">
          Guarulhos, {new Date(contract.createdAt).getDate()} de{' '}
          {new Date(contract.createdAt).toLocaleString('pt-BR', { month: 'long' })} de{' '}
          {new Date(contract.createdAt).getFullYear()}
        </p>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border-t border-black pt-2">
            <p>
              <strong>TRIBO DA FOLIA FESTAS E EVENTOS EIRELI</strong>
              <br />
              CONTRATADA
            </p>
          </div>
          <div className="border-t border-black pt-2">
            <p>
              <strong>{contract.clientName.toUpperCase()}</strong>
              <br />
              CONTRATANTE
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="border-t border-black pt-2 text-left">
            <p>
              Testemunha 1:
              <br />
              CPF:
            </p>
          </div>
          <div className="border-t border-black pt-2 text-left">
            <p>
              Testemunha 2:
              <br />
              CPF:
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
