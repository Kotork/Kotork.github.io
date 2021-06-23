/**
 * @file Biblioteca de classes que representam vários tipos de <em>gráficos</em> a desenhar num <em>canvas</em>, bem como o próprio <em>canvas</em>, <em>audio</em> e <em>video</em>, cujo propósito é facilitar o desenvolvimento de jogos e outras aplicações multimédia. Procura-se que esta biblioteca aborde apenas as situações mais comuns, evitando complexidade desnecessária.
 * @version 0.9
 * @author Ricardo Rodrigues
 * @date 2021-04-30
 * @copyright Ricardo Rodrigues (2021)
 */

/**
 * @class
 * @classdesc A classe <code>Grafico</code> é, na prática, uma classe <em>abstracta</em>, servindo apenas de base para as subclasses de <code>Grafico</code>.
 * @property {number} x Abcissa para posicionar o <em>gráfico</em> no <em>canvas</em>
 * @property {number} y Ordenada para posicionar o <em>gráfico</em> no <em>canvas</em>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>gráfico</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>gráfico</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>x</em> até à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>y</em> até à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>gráfico</em> quando desenhado no <em>canvas</em>
 * @property {boolean} activo=true Indicação de que o <em>gráfico</em> deve testar colisões
 * @property {boolean} visivel=true - Indicação de que o <em>gráfico</em> deve ser desenhado no <em>canvas</em>
 * @property {boolean} seleccionado=false - Indicação de que o <em>gráfico</em> se encontra seleccionado &mdash; pode ser usado, por exemplo, para indicar que foi seleccionado com o cursor do rato
 */
 class Grafico {
  /**
   * Construtor da classe <code>Grafico</code><br><em>Este construtor não deve ser usado directamente. Se tal acontecer, é gerada uma excepção (<code>TypeError</code>.)</em>
   * @param {number} x Abcissa para posicionar o <em>gráfico</em> no <em>canvas</em>
   * @param {number} y Ordenada para posicionar o <em>gráfico</em> no <em>canvas</em>
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.distX = 0;
    this.distY = 0;
    this.angulo = 0;
    this.activo = true;
    this.visivel = true;
    this.seleccionado = false;
    if (this.constructor.name == "Grafico") {
      throw new TypeError("A classe abstracta 'Grafico' não pode ser instanciada directamente, devendo ser implementada através de subclasses (que poderão depois ser instanciadas).");
    }
  }

  /**
   * Este método encontra-se implementado na superclasse <code>Grafico</code>, assumindo que todas as formas definidas nas suas subclasses são limitadas, de um modo genérico, por um rectângulo imaginário que engloba a totalidade do <em>gráfico</em>. <em>Se este método, tal como se encontra definido, não for o mais apropriado para uma dada subclasse, pode ser sempre redefinido (<em>overrided</em>) nessa mesma subclasse.</em>
   * @param {Grafico} outro Outro <em>gráfico</em> para verificar se existe alguma colisão entre esse e este
   * @returns {boolean} Se houver colisão, <code>true</code>; se não, <code>false</code>
   */
  colide(outro) {
    if (this.activo && outro.activo && (this.contemPonto(outro.x, outro.y) || this.contemPonto(outro.x + outro.largura, outro.y) || this.contemPonto(outro.x, outro.y + outro.altura) || this.contemPonto(outro.x + outro.largura, outro.y + outro.altura) || outro.contemPonto(this.x, this.y) || outro.contemPonto(this.x + this.largura, this.y) || outro.contemPonto(this.x, this.y + this.altura) || outro.contemPonto(this.x + this.largura, this.y + this.altura))) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * <em>Este método deve ser implementado nas subclasses de <code>Grafico</code>, respeitando as especifidades de cada forma representada nelas. Se tal não acontecer, é gerada uma excepção (<code>Error</code>.)</em>
   * @param {number} x Abcissa do ponto a testar se está contido
   * @param {number} y Ordenada do ponto a testar se está contido
   * @returns {boolean} Se o ponto estiver contido neste <em>grafico</em>, <code>true</code>; se não, <code>false</code>
   */
  contemPonto(x, y) {
    throw new Error("O método 'contemPonto(x, y)' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }

  /**
   * Este método mais não faz que chamar o método <code>contemPonto(x, y)</code> para cada um dos pontos do <em>array</em>, verificando se algum deles se encontra dentro do <em>gráfico</em>.
   * @param {array} pontos
   * @returns {boolean} Se algum um dos pontos constantes no <em>array</em> estiver contido neste <em>grafico</em>, <code>true</code>; se não, <code>false</code>
   */
  contemPontos(pontos) {
    for (var i = 0; i < pontos.length; i++) {
      if (this.contemPonto(pontos[i].x, pontos[i].y)) {
        return true;
      }
    }
    return false;
  }

  /**
   * <em>Este método deve ser implementado nas subclasses de <code>Grafico</code>, respeitando as especifidades de cada forma representada nelas. Se tal não acontecer, é gerada uma excepção (<code>Error</code>.)</em>
   * @param {Tela} tela Objecto que representa o elemento <em>canvas</em> onde será desenhado o <em>gráfico</em>
   */
  desenha(tela) {
    throw new Error("O método 'desenha(tela)' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Circulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>círculos</em>. Num nível básico, um <em>círculo</em> é definido por um <em>ponto</em> central e por um <em>raio</em>. Contudo, para que exista uniformidade no posicionamento das formas representadas pelas várias subclasses de <code>Grafico</code>, os círculos são também posicionados usando o canto superior esquerdo (de um <em>quadrado</em> imaginário que o contenha), em vez do seu centro &mdash; daí, o <em>raio</em> é somado ao <em>x</em> e ao <em>y</em> para fazer as devidas compensações de posicionamento para determinar o centro.
 * @property {number} x Abcissa para posicionar o <em>círculo</em> no <em>canvas</em>
 * @property {number} y Ordenada para posicionar o <em>círculo</em> no <em>canvas</em>
 * @property {number} raio Raio do <em>círculo</em>
 * @property {string} preenchimento Cor do preenchimento <em>círculo</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>círculo</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>círculo</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>círculo</em> o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>círculo</em> &mdash; se a espessura tiver um valor igual ou inferir a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>círculo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>círculo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>x</em> até à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>y</em> até à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>círculo</em> quando desenhado no <em>canvas</em> &mdash; dadas as características do <em>círculo</em>, esta propriedade é ignorada no desenho (apesar de poder ter outros usos)
 * @property {boolean} activo=true Indicação de que o <em>círculo</em> deve testar colisões
 * @property {boolean} visivel=true Indicação de que o <em>círculo</em> deve ser desenhado no <em>canvas</em>
 * @property {boolean} seleccionado=false Indicação de que o <em>círculo</em> se encontra seleccionado &mdash; pode ser usado, por exemplo, para indicar que foi seleccionado com o cursor do rato */
class Circulo extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Círculo</code>
   * @param {number} x Abcissa para posicionar o <em>círculo</em> no <em>canvas</em>
   * @param {number} y Ordenada para posicionar o <em>círculo</em> no <em>canvas</em>
   * @param {number} raio Raio do <em>círculo</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>círculo</em>
   * @param {string} contorno="black" Cor do contorno do <em>círculo</em>
   * @param {number} espessura=0 Espessura do contorno do <em>círculo</em>
   */
  constructor(x, y, raio, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.raio = raio;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
  }

  /**
   * Largura de um <em>quadrado</em> imaginário que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
   * @type {number}
   */
  get largura() {
    return this.raio * 2;
  }

  /**
   * Altura de um <em>quadrado</em> imaginário que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
   * @type {number}
   */
  get altura() {
    return this.raio * 2;
  }

  /**
   * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>círculo</em>. Tal acontece quando a distância desse <em>ponto</em> ao centro do <em>círculo</em> é inferior ao <em>raio</em> do <em>círculo</em>.
   * @param {number} x Abcissa do ponto a testar se está contido
   * @param {number} y Ordenada do ponto a testar se está contido
   * @returns {boolean} Se o ponto estiver contido neste <em>grafico</em>, <code>true</code>; se não, <code>false</code>
   */
  contemPonto(x, y) {
    if (Math.hypot((this.x + this.raio) - x, (this.y + this.raio) - y) < this.raio) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Este método desenha um <em>círculo</em> no <em>canvas</em>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>quadrado</em> imaginário que envolva o <em>círculo</em>.
   * @param {Tela} tela Objecto que representa o elemento <em>canvas</em> onde será desenhado o <em>gráfico</em>
   */
  desenha(tela) {
    if (this.visivel) {
      // no caso do círculo, definir um ângulo de rotação é irrelevante, pelo que não se implementa, até para evitar processamento desnecessário
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath();
      contexto.arc(Math.floor(this.x + this.raio), Math.floor(this.y + this.raio), this.raio, 0, Math.PI * 2);
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento.toLowerCase() != "empty") {
        contexto.fill();
      }
      if ((this.contorno.toLowerCase() != "empty") && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Rectangulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>rectângulos</em>. Num nível básico, um <em>rectângulo</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e por uma <em>largura</em> e por uma <em>altura</em>.
 * @property {number} x Abcissa para posicionar o <em>rectângulo</em> no <em>canvas</em>
 * @property {number} y Ordenada para posicionar o <em>rectângulo</em> no <em>canvas</em>
 * @property {number} largura Largura do <em>rectângulo</em>
 * @property {number} altura Altura do <em>rectângulo</em>
 * @property {string} preenchimento Cor do preenchimento <em>rectângulo</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>rectângulo</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>rectângulo</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>rectângulo</em> o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>rectângulo</em> &mdash; se a espessura tiver um valor igual ou inferir a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>rectângulo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>rectângulo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>x</em> até à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>y</em> até à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>rectângulo</em> quando desenhado no <em>canvas</em>
 * @property {boolean} activo=true Indicação de que o <em>rectângulo</em> deve testar colisões
 * @property {boolean} visivel=true Indicação de que o <em>rectângulo</em> deve ser desenhado no <em>canvas</em>
 * @property {boolean} seleccionado=false Indicação de que o <em>rectângulo</em> se encontra seleccionado &mdash; pode ser usado, por exemplo, para indicar que foi seleccionado com o cursor do rato */
class Rectangulo extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>
   * @param {number} x Abcissa para posicionar o <em>rectângulo</em> no <em>canvas</em>
   * @param {number} y Ordenada para posicionar o <em>rectângulo</em> no <em>canvas</em>
   * @param {number} largura Largura do <em>rectângulo</em>
   * @param {number} altura Altura do <em>rectângulo</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>rectângulo</em>
   * @param {string} contorno="black" Cor do contorno do <em>rectângulo</em>
   * @param {number} espessura=0 Espessura do contorno do <em>rectângulo</em>
   */
  constructor(x, y, largura, altura, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.largura = largura;
    this.altura = altura;
    // ATENÇÃO: se o valor do preenchimento for definido como "empty", a forma não é preenchida
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    // ATENÇÃO: se o contorno tiver uma espessura de 0(px), não é desenhado
    this.espessura = espessura;
  }

  /**
   * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>rectângulo</em>. Tal acontece quando o <em>x</em> do ponto se encontra compreendido entre o <em>x</em> do <em>rectângulo</em> e <em>x</em> mais a <em>largura</em> do <em>rectângulo</em>, e o <em>y</em> do ponto se encontra compreendido entre o <em>y</em> do <em>rectângulo</em> e <em>y</em> mais a <em>altura</em> do <em>rectângulo</em>.
   * @param {number} x Abcissa do ponto a testar se está contido
   * @param {number} y Ordenada do ponto a testar se está contido
   * @returns {boolean} Se o ponto estiver contido neste <em>grafico</em>, <code>true</code>; se não, <code>false</code>
   */
  contemPonto(x, y) {
    if ((this.x <= x) && (this.x + this.largura >= x) && (this.y <= y) && (this.y + this.altura >= y)) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Este método desenha um <em>rectângulo</em> no <em>canvas</em>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo desse <em>rectângulo</em>.
   * @param {Tela} tela Objecto que representa o elemento <em>canvas</em> onde será desenhado o <em>gráfico</em>
   */
  desenha(tela) {
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath();
      // para evitar processamento desnecessário, só se faz a translação e a rotação do canvas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer translação e rotação
      if (this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.rect(Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
      }
      else {
        contexto.rect(Math.floor(this.x), Math.floor(this.y), this.largura, this.altura);
      }
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento.toLowerCase() != "empty") {
        contexto.fill();
      }
      if ((this.contorno.toLowerCase() != "empty") && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Poligono</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>polígonos</em>. Num nível básico, um <em>polígono</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo de um <em>rectângulo</em> imaginário que contenha o <em>polígono</em>.
 * @property {number} x Abcissa para posicionar o <em>polígono</em> no <em>canvas</em>
 * @property {number} y Ordenada para posicionar o <em>polígono</em> no <em>canvas</em>
 * @property {array} pontos Conjunto de pontos com os vários vértices do <em>polígono</em>
 * @property {string} preenchimento Cor do preenchimento <em>polígono</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>polígono</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>polígono</em> &mdash; se a cor for especificada como <code>empty</code>, o <em>polígono</em> o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>polígono</em> &mdash; se a espessura tiver um valor igual ou inferir a zero (<code>0</code>), o contorno não é desenhado
 * @property {boolean} ajuste=true Indicação de que o <em>polígono</em> deve ser reposicionado de forma a ficar <em>encostado</em> o ponto usado para definir o seu posicionamento no <em>canvas</em>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>polígono</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>polígono</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>x</em> até à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usado, por exemplo, para guardar o <em>offset</em> do <em>y</em> até à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>polígono</em> quando desenhado no <em>canvas</em>
 * @property {boolean} activo=true Indicação de que o <em>polígono</em> deve testar colisões
 * @property {boolean} visivel=true Indicação de que o <em>polígono</em> deve ser desenhado no <em>canvas</em>
 * @property {boolean} seleccionado=false Indicação de que o <em>polígono</em> se encontra seleccionado &mdash; pode ser usado, por exemplo, para indicar que foi seleccionado com o cursor do rato */
class Poligono extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>
   * @param {number} x Abcissa para posicionar o <em>polígono</em> no <em>canvas</em>
   * @param {number} y Ordenada para posicionar o <em>polígono</em> no <em>canvas</em>
   * @param {array} pontos Largura do <em>rectângulo</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>polígono</em>
   * @param {string} contorno="black" Cor do contorno do <em>polígono</em>
   * @param {number} espessura=0 Espessura do contorno do <em>polígono</em>
   * @param {boolean} ajuste=true Indicação de que o <em>polígono</em> deve ser reposicionado de forma a ficar <em>encostado</em> o ponto usado para definir o seu posicionamento no <em>canvas</em>
   */
  constructor(x, y, pontos, preenchimento = "black", contorno = "black", espessura = 0, ajuste = true) {
    // ATENÇÃO: as coordenadas (x, y) correspondem ao canto superior esquerdo de um rectângulo imaginário que conterá o polígono (a origem) e, assim, será o ponto relativamente ao qual todos os pontos do polígono serão posicionados; aconselha-se que todos os pontos do polígono se encontrem à direita e abaixo desta origem e tão próximos dela quanto possível; caso contrário, aspectos como a rotação do polígono poderão ter resultados diferentes do esperado, o mesmo acontecendo com as colisões baseadas nesse rectângulo imaginário; há a possibilidade, activada por omissão através do atributo ajuste, de "encostar" o polígono à origem -- contudo, tal implica uma alteração (ajuste) de todos os pontos
    super(x, y);
    this.pontos = pontos;
    // ATENÇÃO: se o valor do preenchimento for definido como "empty", a forma não é preenchida
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    // ATENÇÃO: se o contorno tiver uma espessura de 0(px), não é desenhado
    this.espessura = espessura;
    // ATENÇÃO: se ajuste for verdadeiro (true), todo os pontos são alterados de forma a que o polígono seja "encostado" à origem -- o ponto (x, y) do polígono; se for necessário recuperar os pontos originais, tal pode ser feito com auxílio dos atributos deslocX e deslocY; se ajuste for verdadeiro, desaconselha-se a alteração do atributo pontos depois de criada a instância da classe
    this.ajuste = ajuste;
    this.deslocX = 0;
    this.deslocY = 0;
    if (this.ajuste) {
      this.deslocX = Number.MAX_VALUE;
      for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
        this.deslocX = Math.min(this.deslocX, this.pontos[i].x);
      }
      this.deslocY = Number.MAX_VALUE;
      for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
        this.deslocY = Math.min(this.deslocY, this.pontos[i].y);
      }
      for (var i = 0; i < this.pontos.length; i++) {
        pontos[i].x -= this.deslocX;
        pontos[i].y -= this.deslocY;
      }
    }
  }

  /**
   * Largura de um <em>rectângulo</em> imaginário que envolva este <em>polígono</em> &mdash, sendo definida pela distância entre o <em>x</em> do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>polígono</em>
   * @type {number}
   */
  get largura() {
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      minX = Math.min(minX, this.pontos[i].x);
      maxX = Math.max(maxX, this.pontos[j].x);
    }
    return maxX - minX;
  }

  /**
   * Altura de um <em>rectângulo</em> imaginário que envolva este <em>polígono</em> &mdash, sendo definida pela distância entre o <em>y</em> do ponto mais acima e o <em>y</em> do ponto mais abaixo do <em>polígono</em>
   * @type {number}
   */
  get altura() {
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      minY = Math.min(minY, this.pontos[i].y);
      maxY = Math.max(maxY, this.pontos[j].y);
    }
    return maxY - minY;
  }

  /**
    * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>polígono</em>. Tal acontece quando um segmento de recta com início no ponto especificado intersecta um número ímpar de arestas do <em>polígono</em>.
    * @param {number} x Abcissa do ponto a testar se está contido
    * @param {number} y Ordenada do ponto a testar se está contido
    * @returns {boolean} Se o ponto estiver contido neste <em>grafico</em>, <code>true</code>; se não, <code>false</code>
    */
  contemPonto(x, y) {
    var contido = false;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      var pontoI = { x: this.pontos[i].x + this.x, y: this.pontos[i].y + this.y };
      var pontoJ = { x: this.pontos[j].x + this.x, y: this.pontos[j].y + this.y };
      if (((pontoI.y > y) != (pontoJ.y > y)) && (x < (pontoJ.x - pontoI.x) * (y - pontoI.y) / (pontoJ.y - pontoI.y) + pontoI.x)) {
        contido = !contido;
      }
    }
    return contido;
  }

  /**
   * Este método desenha um <em>polígono</em> no <em>canvas</em>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo</em> imaginário que contenha o <em>polígono</em>.
   * @param {Tela} tela Objecto que representa o elemento <em>canvas</em> onde será desenhado o <em>gráfico</em>
   */
  desenha(tela) {
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath()
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o angulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        for (var i = 0; i < this.pontos.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.pontos[i].x - this.largura * 0.5), Math.floor(this.pontos[i].y - this.altura * 0.5));
          }
          else {
            contexto.lineTo(Math.floor(this.pontos[i].x - this.largura * 0.5), Math.floor(this.pontos[i].y - this.altura * 0.5));
          }
        }
      }
      else {
        for (var i = 0; i < this.pontos.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.pontos[i].x + this.x), Math.floor(this.pontos[i].y + this.y));
          }
          else {
            contexto.lineTo(Math.floor(this.pontos[i].x + this.x), Math.floor(this.pontos[i].y + this.y));
          }
        }
      }
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento.toLowerCase() != "empty") {
        contexto.fill();
      }
      if ((this.contorno.toLowerCase() != "empty") && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

// CLASSE: Texto
class Texto extends Grafico {
  /**
   * DESCRIÇÃO...
   * @param {any} x
   * @param {any} y
   * @param {any} texto
   * @param {any} preenchimento="black"
   * @param {any} contorno="black"
   * @param {any} espessura=0
   * @returns {any}
   */
  constructor(x, y, texto, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.texto = texto;
    // ATENÇÃO: se o valor do preenchimento for definido como "empty", a forma não é preenchida
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    // ATENÇÃO: se o contorno tiver uma espessura de 0(px), não é desenhado
    this.espessura = espessura;
    // ATENÇÃO: por omissão, o tamanho do texto (fonte) é de 16(px)
    this.tamanho = 16;
    // ATENÇÃO: por omissão, a fonte é sem serifas -- a que o sistema tiver predefinida
    this.fonte = "sans-serif";
    // ATENÇÃO: por omissão, o alinhamento é feito à esquerda
    this.alinhamento = "left";
    // ATENÇÃO: por omissão, a base é feita ao topo do texto
    this.base = "top";
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get largura() {
    var tela = document.createElement("canvas");
    var contexto = tela.getContext("2d");
    contexto.font = this.altura + "px " + this.fonte;
    return Math.floor(contexto.measureText(this.texto).width);
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get altura() {
    return this.tamanho;
  }

  /**
   * DESCRIÇÃO...
   * @param {any} x
   * @param {any} y
   * @returns {any}
   */
  contemPonto(x, y) {
    if ((this.x <= x) && (this.x + this.largura >= x) && (this.y <= y) && (this.y + this.altura >= y)) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * DESCRIÇÃO...
   * @param {any} tela
   * @returns {any}
   */
  desenha(tela) {
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.textAlign = this.alinhamento;
      contexto.textBaseline = this.base;
      contexto.font = this.tamanho + "px " + this.fonte;
      contexto.fillStyle = this.preenchimento;
      // ATENÇÃO: para evitar processamento desnecessário, só se faz a translação e a rotação quando o angulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        if (this.preenchimento.toLowerCase() != "empty") {
          contexto.fillText(this.texto, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        }
        if ((this.contorno.toLowerCase() != "empty") && (this.espessura > 0)) {
          contexto.strokeText(this.texto, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        }
      }
      else {
        if (this.preenchimento.toLowerCase() != "empty") {
          contexto.fillText(this.texto, Math.floor(this.x), Math.floor(this.y));
        }
        if ((this.contorno.toLowerCase() != "empty") && (this.espessura > 0)) {
          contexto.strokeText(this.texto, Math.floor(this.x), Math.floor(this.y));
        }
      }
      contexto.restore();
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

// CLASSE: Imagem
class Imagem extends Grafico {
  /**
   * DESCRIÇÃO...
   * @param {any} x
   * @param {any} y
   * @param {any} imagem
   * @returns {any}
   */
  constructor(x, y, imagem) {
    super(x, y);
    this.imagem = imagem;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get largura() {
    return this.imagem.width;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get altura() {
    return this.imagem.height;
  }

  contemPonto(x, y) {
    if ((this.x <= x) && (this.x + this.largura >= x) && (this.y <= y) && (this.y + this.altura >= y)) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * DESCRIÇÃO...
   * @param {any} tela
   * @returns {any}
   */
  desenha(tela) {
    if (this.visivel) {
      var contexto = tela.contexto;
      // ATENÇÃO: para evitar processamento desnecessário, só se faz a translação e a rotação quando o angulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.angulo != 0) {
        contexto.save();
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.drawImage(this.imagem, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        contexto.restore();
      }
      else {
        contexto.drawImage(this.imagem, Math.floor(this.x), Math.floor(this.y));
      }
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

// CLASSE: ImagemAnimada (apenas para "sprites" com uma sequência horizontal e com fotogramas de dimensões idênticas)
class ImagemAnimada extends Imagem {
  /**
   * DESCRIÇÃO...
   * @param {any} x
   * @param {any} y
   * @param {any} imagem
   * @param {any} fotogramas
   * @param {any} iteracoes
   * @returns {any}
   */
  constructor(x, y, imagem, fotogramas, iteracoes) {
    super(x, y, imagem);
    this.fotogramas = fotogramas;
    this.iteracoes = iteracoes;
    this.animada = true;
    this.indice = 0;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get largura() {
    return this.imagem.width / this.fotogramas;
  }

  /**
   * DESCRIÇÃO...
   * @param {any} tela
   * @returns {any}
   */
  desenha(tela) {
    if (this.visivel) {
      var contexto = tela.contexto;
      // ATENÇÃO: para evitar processamento desnecessário, só se faz a translação e a rotação quando o angulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.angulo != 0) {
        contexto.save();
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.drawImage(this.imagem, this.indice * this.largura, 0, this.largura, this.altura, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
        contexto.restore();
      }
      else {
        contexto.drawImage(this.imagem, this.indice * this.largura, 0, this.largura, this.altura, Math.floor(this.x), Math.floor(this.y), this.largura, this.altura);
      }
      if ((this.animada) || (this.indice > 0)) {
        if (this.contador % this.iteracoes == 0) {
          this.indice++;
          if (indice >= this.fotogramas) {
            indice = 0;
          }
        }
        this.indice = this.apontador % this.fotogramas;
        this.contador++;
      }
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
  }
}

//

/**
 * Esta função desenha um <em>gráfico</em> ou percorre um <em>array</em> de <em>gráficos</em> (instâncias ou objectos de subclasses da classe <code>Grafico</code> e desenha-os no <em>canvas</em> especificado. O <em>array</em> pode conter também <em>arrays</em> em qualquer das suas posições, já que esta função é recursiva.
 * @param {Grafico} graficos Um <em>gráfico</em> ou um <em>array</em> de <em>gráficos</em>
 * @param {Tela} tela O <em>canvas</em> onde vão ser desenhados os <em>gráficos</em>
 */
function desenhaGraficos(graficos, tela) {
  for (var i = 0; i < graficos.length; i++) {
    if (Array.isArray(graficos[i])) {
      desenhaGraficos(graficos[i], tela);
    } else {
      graficos[i].desenha(tela);
    }
  }
}

//

// CLASSE: Tela
class Tela {
  /**
   * DESCRIÇÃO...
   * @param {any} tela
   * @returns {any}
   */
  constructor(tela) {
    this.tela = tela;
  }

  // ATENÇÃO: este método (getter) devolve o elemento original usado na criação de uma instância da classe Tela, para que possa ser manipulado directamente -- por exemplo, quando é necessário adicionar eventos ao elemento
  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get elemento() {
    return this.tela;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get contexto() {
    return this.tela.getContext("2d");
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get largura() {
    return this.tela.width;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get altura() {
    return this.tela.height;
  }

  // ATENÇÃO: este método (getter) devolve a largura do elemento na página web, incluindo quaisquer alterações decorrentes da utilização de CSS
  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get larguraFinal() {
    return this.tela.offsetWidth;
  }

  // ATENÇÃO: este método (getter) devolve a altura do elemento na página web, incluindo quaisquer alterações decorrentes da utilização de CSS
  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get alturaFinal() {
    return this.tela.offsetHeight;
  }
}

//

// CLASSE: Media
class Media {
  /**
   * DESCRIÇÃO...
   * @param {any} media
   * @returns {any}
   */
  constructor(media) {
    this.media = media;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get elemento() {
    return this.media;
  }

  /**
   * DESCRIÇÃO...
   * @param {any} fonte
   * @returns {any}
   */
  set fonte(fonte) {
    this.media.src = fonte;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get fonte() {
    return this.media.src;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get duracao() {
    return this.media.duration;
  }

  /**
   * DESCRIÇÃO...
   * @param {any} volume
   * @returns {any}
   */
  set volume(volume) {
    this.media.volume = volume;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get volume() {
    return this.media.volume;
  }

  /**
   * DESCRIÇÃO...
   * @param {any} tempo
   * @returns {any}
   */
  set indicador(tempo) {
    this.media.currentTime = tempo;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get indicador() {
    return this.media.currentTime;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  reproduz(inicio = false) {
    if (inicio) {
      this.media.currentTime = 0;
    }
    this.media.play();
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  pausa() {
    this.media.pause();
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  para() {
    this.pausa();
    this.media.currentTime = 0;
  }
}

// CLASSE: Som
class Som extends Media {
  /**
   * DESCRIÇÃO...
   * @param {any} som
   * @returns {any}
   */
  constructor(som) {
    super(som);
  }
}

//

// CLASSE: Filme
class Filme extends Media {
  /**
   * DESCRIÇÃO...
   * @param {any} filme
   * @returns {any}
   */
  constructor(filme) {
    super(filme);
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get largura() {
    return this.filme.videoWidth;
  }

  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get altura() {
    return this.filme.videoHeight;
  }

  // ATENÇÃO: este método (getter) devolve a largura do elemento na página web, incluindo quaisquer alterações decorrentes da utilização de CSS
  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get larguraFinal() {
    return this.filme.offsetWidth;
  }

  // ATENÇÃO: este método (getter) devolve a altura do elemento na página web, incluindo quaisquer alterações decorrentes da utilização de CSS
  /**
   * DESCRIÇÃO...
   * @returns {any}
   */
  get alturaFinal() {
    return this.filme.offsetHeight;
  }
}
