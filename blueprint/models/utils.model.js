export class Utils{


    static toScreen(position, offset, scale) {
        return (position + offset) * scale;
    }
    
    static toTrue(screen, offset, scale) {
        return screen / scale - offset;
    }

    static toVirtual(real, offset, scale = 1) {
        return (real - offset) * scale;
    }
    
}