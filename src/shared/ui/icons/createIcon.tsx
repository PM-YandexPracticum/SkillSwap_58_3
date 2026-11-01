import type { ComponentType, SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Оборачивает SVG-компонент и задаёт дефолтный размер 24 */
export function createIcon(Svg: SvgComponent) {
  return function Icon({ size = 24, width, height, ...rest }: IconProps) {
    return <Svg width={width ?? size} height={height ?? size} {...rest} />
  }
}
